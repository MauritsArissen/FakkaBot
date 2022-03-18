import { Bot } from "../client";

export default {
  name: "ready",
  once: true,
  execute(client: Bot) {
    client.user.setPresence({
      activities: [
        {
          name: `nothing...`,
        },
      ],
    });
  },
};
