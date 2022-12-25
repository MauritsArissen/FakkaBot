import { yellow } from "colorette";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    Logger.info(`Ready! Logged in as ${yellow(client.user.tag)}`);
  },
};
