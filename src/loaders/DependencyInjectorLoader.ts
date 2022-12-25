import { Model, Sequelize } from "sequelize-typescript";
import Container from "typedi";
import { Bot } from "../client";
import Logger from "../util/Logger";

class DependencyInjectorLoader {
  private _client: Bot;
  private _db: Sequelize;
  private _models: { name: string; model: Model }[];

  constructor(
    client: Bot,
    db: Sequelize,
    models: { name: string; model: Model }[]
  ) {
    this._client = client;
    this._db = db;
    this._models = models;
  }

  public load(): void {
    Logger.info("Loading dependency injection...");
    try {
      Container.set("client", this._client);
      Container.set("db", this._db);

      this._models.forEach((m) => {
        Container.set(m.name, m.model);
      });

      return;
    } catch (err) {
      Logger.error("Error on dependency injector loader: %o", err);
      throw err;
    }
  }
}

export default DependencyInjectorLoader;
