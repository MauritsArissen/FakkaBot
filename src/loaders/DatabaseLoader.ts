import { Sequelize } from "sequelize-typescript";
import { Bot } from "../client";
import config from "../config";
import models from "../config/models";
import Logger from "../util/Logger";

class DatabaseLoader {
  private _models;

  constructor() {
    this._models = Object.values(models);
  }

  public async load(): Promise<Sequelize> {
    Logger.info("Loading database...");
    if (process.env.NODE_ENV == "production") {
      const SequelizeInstance = new Sequelize(config.databaseUrl, {
        dialect: "postgres",
        sync: { force: false },
        models: this._models,
        logging: false,
      });
      await SequelizeInstance.sync();
      return SequelizeInstance;
    } else {
      const SequelizeInstance = new Sequelize({
        dialect: "sqlite",
        storage: "database.sqlite",
        models: this._models,
        logging: false,
      });
      await SequelizeInstance.sync();
      return SequelizeInstance;
    }
  }
}

export default DatabaseLoader;
