import { Model } from "sequelize-typescript";
import { Bot } from "../client";
import modelLoader from "./models";
import eventsLoader from "./events";
import interactionLoader from "./interactions";
import databaseLoader from "./database";
import dependencyInjectorLoader from "./dependencyInjector";
import Logger from "../util/Logger";

export default async ({ client }: { client: Bot }) => {
  const db = await databaseLoader();
  Logger.info("Database loaded");

  const models: { name: string; model: Model }[] = modelLoader();
  Logger.info("Models list loaded");

  await dependencyInjectorLoader({ client, db, models });
  Logger.info("Dependency Injector loaded");

  await interactionLoader({ client });
  Logger.info("Interactions loaded");

  await eventsLoader({ client });
  Logger.info("Events loaded");

  // Start database logging
  Logger.startSavingLogs();
};
