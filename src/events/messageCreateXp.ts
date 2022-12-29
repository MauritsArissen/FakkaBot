import { Message } from "discord.js";
import LevelHelper from "../util/LevelHelper";

export default {
  name: "messageCreate",
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;
    const xp = Math.round(Math.random() * 10 + 15);
    LevelHelper.addXp(message.author.id, xp, 60);
  },
};
