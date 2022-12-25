import { Model, Sequelize } from "sequelize-typescript";
import Container from "typedi";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default ({
  client,
  db,
  models,
}: {
  client: Bot;
  db: Sequelize;
  models: { name: string; model: Model }[];
}) => {
  try {
    Container.set("client", client);
    Container.set("db", db);

    models.forEach((m) => {
      Container.set(m.name, m.model);
    });

    return;
  } catch (err) {
    Logger.error("Error on dependency injector loader: %o", err);
    throw err;
  }
};
