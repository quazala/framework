export class Router {
  constructor() {
    this.root = {};
  }

  add(path, handler) {
    let node = this.root;
    const parts = path.split('/').filter((part) => part !== '');

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!node[part]) {
        node[part] = {};
      }
      node = node[part];
    }

    node.handler = handler;
  }

  find(path) {
    const parts = path.split('/').filter((part) => part !== '');
    const params = {};

    function searchNode(node, index) {
      if (index === parts.length) {
        return node.handler;
      }

      const part = parts[index];

      // Check for exact match
      if (node[part]) {
        const result = searchNode(node[part], index + 1);
        if (result) return result;
      }

      // Check for parameter match
      for (const key in node) {
        if (key.startsWith(':')) {
          params[key.slice(1)] = part;
          const result = searchNode(node[key], index + 1);
          if (result) return result;
          delete params[key.slice(1)];
        }
      }

      // Check for wildcard match
      if (node['*']) {
        params.wildcard = parts.slice(index).join('/');
        return node['*'].handler;
      }

      return null;
    }

    const handler = searchNode(this.root, 0);
    return handler ? { handler, params } : null;
  }
}
