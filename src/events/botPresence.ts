import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    Logger.log("Setting bot presence", "EVENT");
    client.user.setPresence({
      activities: [
        {
          name: `nothing...`,
        },
      ],
    });
  },
};
