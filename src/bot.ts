import { Bot } from "./client";
import config from "./config";
import loaders from "./loaders";

async function startBot() {
  const client = new Bot();

  await loaders({ client: client });

  client.login(config.token);
}

startBot();
