import { yellow } from "colorette";
import { CommandInteraction } from "discord.js";
import { container } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

class MessageInteractionCreateEvent implements IEvent {
  getEventType(): string {
    return "interactionCreate";
  }

  getEventOccurance(): boolean {
    return false;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isCommand()) return;

    const client: Bot = container.resolve(Bot);

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

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
