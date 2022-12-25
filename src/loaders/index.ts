import { Bot } from "../client";
import DatabaseLoader from "./DatabaseLoader";
import DependencyInjectorLoader from "./DependencyInjectorLoader";
import InteractorLoader from "./InteractorLoader";
import EventLoader from "./EventLoader";
import Logger from "../util/Logger";
import { green } from "colorette";
import ModelLoader from "./ModelLoader";

export default async ({ client }: { client: Bot }) => {
  Logger.info("STARTING APPLICATION!");
  const db = await new DatabaseLoader().load();
  const models = new ModelLoader().load();
  await new DependencyInjectorLoader(client, db, models).load();
  new InteractorLoader(client).load();
  await new EventLoader(client).load();
  await Logger.info(green("Successfully ran all loaders!"));
};
