import { REST, Routes } from "discord.js";
import { Bot } from "../client";
import config from "../config";
import Logger from "../util/Logger";

export default {
  name: "ready",
  once: true,
  async execute(client: Bot) {
    const commands = [];

    client.commands.each((cmd) => commands.push(cmd.data.toJSON()));

    const rest = new REST({ version: "10" }).setToken(config.token);

    if (process.env.NODE_ENV == "production") {
      // Register all commands globally.
      Logger.info(
        `Started refreshing ${commands.length} application (/) commands [GLOBALLY]`
      );

      const data: any = await rest.put(
        Routes.applicationCommands(client.user.id),
        { body: commands }
      );

      Logger.info(
        `Successfully reloaded ${data.length} application (/) commands [GLOBALLY]`
      );
    } else {
      // Register all commands for each individual guild the bot is in.
      const guilds = await client.guilds.fetch();
      guilds.forEach(async (guild) => {
        try {
          Logger.info(
            `Started refreshing ${commands.length} application (/) commands for ${guild.name}.`
          );

          const data: any = await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: commands }
          );

          Logger.info(
            `Successfully reloaded ${data.length} application (/) commands for ${guild.name}`
          );
        } catch (error) {
          Logger.error(
            `Failed to reload application (/) commands for ${guild.name}\n\n${error}\n`
          );
        }
      });
    }
  },
};
