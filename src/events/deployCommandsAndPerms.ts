import { yellow } from "colorette";
import { REST, Routes } from "discord.js";
import { Bot } from "../client";
import config from "../config";
import IEvent from "../entities/interfaces/IEvent";
import Logger from "../util/Logger";

class DeployCommandsEvent implements IEvent {
  getEventType(): string {
    return "ready";
  }

  getEventOccurance(): boolean {
    return true;
  }

  async execute(client: Bot): Promise<void> {
    const commands = [];

    client.commands.each((cmd) =>
      commands.push(cmd.getSlashCommandBuilder().toJSON())
    );

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
          const data: any = await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild.id),
            { body: commands }
          );

          Logger.info(
            `Successfully reloaded ${
              data.length
            } application (/) commands for ${yellow(guild.name)}`
          );
        } catch (error) {
          Logger.error(
            `Failed to reload application (/) commands for ${yellow(
              guild.name
            )}`,
            error
          );
        }
      });
    }
  }
}

export default DeployCommandsEvent;
