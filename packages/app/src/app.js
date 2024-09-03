import { Router } from "@quazala/router";
import { Server } from "@quazala/server";
import { FileStructureReader } from "@quazala/file-structure-reader";

export class App {
  constructor(options) {
    const { logger } = options;
    this.logger = logger;
    this.router = new Router();
    this.server = new Server(this);
  }

  #readAndValidateConfig() {
    this.configFS = new FileStructureReader("./config");
  }

  #registerAuth() {
    this.authFS = new FileStructureReader("./auth");
  }

  #registerHandlers(mode) {
    this.handlerFS = new FileStructureReader("./handlers");
  }

  #registerDatabases() {
    this.databasesFS = new FileStructureReader("./databases");
  }

  #registerWorkers() {
    this.workersFS = new FileStructureReader("./workers");
  }

  #registerBuses() {}

  getHandler(path) {
    const file = this.router.find(path);
  }

  getAuth(authStrategy) {}
}
