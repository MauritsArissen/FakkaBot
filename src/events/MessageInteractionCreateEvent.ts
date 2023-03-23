import { yellow } from "colorette";
import { CommandInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class MessageInteractionCreateEvent implements IEvent {
  constructor(private client?: Bot) {}

  getEventType(): string {
    return "interactionCreate";
  }

  getEventOccurance(): boolean {
    return false;
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    if (!interaction.isCommand()) return;

    const command = this.client.commands.get(interaction.commandName);

    if (!command) return;

    if (!(await command.hasPermissions(interaction)))
      return await interaction.reply({
        content: "You do not have permissions to use this command!",
        ephemeral: true,
      });

    try {
      Logger.command(
        `${interaction.user.username} used command ${yellow(
          "/" + interaction.commandName
        )} with payload: ${JSON.stringify(interaction.options)}`
      );
      await command.execute(interaction);
    } catch (err) {
      Logger.error(err);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}

export default MessageInteractionCreateEvent;
