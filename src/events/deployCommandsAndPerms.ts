import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Guild } from "discord.js";
import { Bot } from "../client";
import config from "../config";

export default {
  name: "ready",
  once: true,
  async execute(client: Bot) {
    var commands = [];

    client.commands.each((cmd) => commands.push(cmd.data.toJSON()));

    const rest = new REST({ version: "9" }).setToken(config.token);

    const guilds = await client.guilds.fetch();
    guilds.forEach(async (guild) => {
      await rest
        .put(Routes.applicationGuildCommands(client.user.id, guild.id), {
          body: commands,
        })
        .then(() =>
          client.logger.info(
            `\tSuccesfully registered application commands for ${guild.name}`
          )
        )
        .catch(client.logger.error);

      const guildCommands = await (await guild.fetch()).commands.fetch();
      guildCommands.forEach(async (cmd) => {
        if (!client.commands.get(cmd.name).permissions) return;
        await cmd.permissions.set({
          permissions: client.commands.get(cmd.name).permissions,
        });
      });
    });
  },
};
