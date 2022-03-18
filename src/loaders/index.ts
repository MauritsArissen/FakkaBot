import { Model } from "sequelize-typescript";
import { Bot } from "../client";
import modelLoader from "./models";
import eventsLoader from "./events";
import interactionLoader from "./interactions";
import databaseLoader from "./database";
import dependencyInjectorLoader from "./dependencyInjector";

export default async ({ client }: { client: Bot }) => {
  const db = await databaseLoader();
  client.logger.info("Database loaded");

  const models: { name: string; model: Model }[] = modelLoader();
  client.logger.info("Models list loaded");

  await dependencyInjectorLoader({ client, db, models });
  client.logger.info("Dependency Injector loaded");

  await interactionLoader({ client });
  client.logger.info("Interactions loaded");

  await eventsLoader({ client });
  client.logger.info("Events loaded");
};
