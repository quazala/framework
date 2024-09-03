import { Readable } from 'node:stream';
import mime from 'mime';
import { Transport } from './abstract';

export class HttpTransport extends Transport {
  constructor(server, req, res) {
    super(server, req);
    this.res = res;
    req.on('close', () => {
      this.emit('close');
    });
  }

  setCorsHeaders() {
    const { req, res, server } = this;
    const corsOptions = server.corsOptions[0]; // Assuming we're using the first CORS configuration

    const origin = req.headers.origin;
    if (origin && (corsOptions.AllowOrigin.includes(origin) || corsOptions.AllowOrigin[0] === '*')) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (corsOptions.AllowOrigin[0] === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', corsOptions.AllowMethods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', corsOptions.AllowHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', corsOptions.MaxAge.toString());
    }

    res.setHeader('Access-Control-Expose-Headers', corsOptions.ExposeHeaders.join(', '));

    if (corsOptions.AllowCredentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  handleCors() {
    const { req, res } = this;

    this.setCorsHeaders();

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return true;
    }

    return false;
  }

  json(data, httpCode = 200) {
    const { res } = this;
    this.setCorsHeaders();
    res.writeHead(httpCode, { 'Content-Type': mime.getType('json') });
    res.end(JSON.stringify(data));
  }

  write(data, httpCode = 200, ext = 'json', options = {}) {
    const { res } = this;
    if (res.writableEnded) {
      return;
    }

    this.setCorsHeaders();

    const streaming = data instanceof Readable;
    let mimeType = mime.getType('html');
    if (httpCode === 200) {
      const fileType = mime.getType(ext);
      if (fileType) mimeType = fileType;
    }

    const headers = { 'Content-Type': mimeType };

    if (httpCode === 206) {
      const { start, end, size = '*' } = options;
      headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
      headers['Accept-Ranges'] = 'bytes';
      headers['Content-Length'] = end - start + 1;
    }

    if (streaming) {
      res.writeHead(httpCode, headers);
      return void data.pipe(res);
    }

    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    headers['Content-Length'] = buf.length;
    res.writeHead(httpCode, headers);
    res.end(data);
  }

  getSession() {
    throw new Error(501);
  }

  setSession() {
    throw new Error(501);
  }

  close() {
    this.error(503);
    this.req.connection.destroy();
  }

  redirect() {
    const { res } = this;
    if (res.headersSent) return;
    res.writeHead(302, { Location: location, ...DEFAULT_HEADERS });
    res.end();
  }
}
