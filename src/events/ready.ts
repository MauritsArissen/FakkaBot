import { Bot } from "../client";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    client.logger.info(`Ready! Logged in as ${client.user.tag}`);
  },
};
