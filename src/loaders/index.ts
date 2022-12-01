import { Model } from "sequelize-typescript";
import { Bot } from "../client";
import modelLoader from "./models";
import eventsLoader from "./events";
import databaseLoader from "./database";
import dependencyInjectorLoader from "./dependencyInjector";
import InteractorLoader from "./InteractorLoader";

export default async ({ client }: { client: Bot }) => {
  const db = await databaseLoader();
  client.logger.info("Database loaded");

  const models: { name: string; model: Model }[] = modelLoader();
  client.logger.info("Models list loaded");

  await dependencyInjectorLoader({ client, db, models });
  client.logger.info("Dependency Injector loaded");

  const interactorLoader: InteractorLoader = new InteractorLoader(client);
  interactorLoader.load();
  client.logger.info("Interactions loaded");

  await eventsLoader({ client });
  client.logger.info("Events loaded");
};
