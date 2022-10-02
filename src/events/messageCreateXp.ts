import { Message } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";
import LevelHelper from "../util/LevelHelper";

export default {
    name: "messageCreate",
    once: false,
    async execute(message: Message) {
        if (message.author.bot) return;
        const client: Bot = Container.get("client");
        if (!client.xpCooldown.has(message.author.id)) LevelHelper.addXp(message.author.id, Math.round(Math.random()*10+15), 60);
    }
}