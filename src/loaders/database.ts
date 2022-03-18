import { Sequelize } from "sequelize-typescript";
import config from "../config";
import models from "../config/models";

const _models = Object.values(models);

export default async (): Promise<Sequelize> => {
  switch (process.env.NODE_ENV) {
    case "production":
      const SequelizeInstance = new Sequelize(config.databaseUrl, {
        dialect: "postgres",
        sync: { force: false },
        models: _models,
        logging: false,
      });
      await SequelizeInstance.sync();
      return SequelizeInstance;

    default: {
      const SequelizeInstance = new Sequelize({
        dialect: "sqlite",
        storage: "database.sqlite",
        models: _models,
        logging: false,
      });
      await SequelizeInstance.sync();
      return SequelizeInstance;
    }
  }
};
