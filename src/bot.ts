import { Bot } from "./client";
import config from "./config";

async function startBot() {
  const client = new Bot();

  await require("./loaders").default({ client: client });

  client.login(config.token);
}

startBot();
