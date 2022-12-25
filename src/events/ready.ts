import { green } from "colorette";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    Logger.info(green(`Ready! Logged in as ${client.user.tag}`));
  },
};
