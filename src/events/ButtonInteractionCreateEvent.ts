import { ButtonInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class ButtonInteractionCreateEvent implements IEvent {
  constructor(private client?: Bot) {}

  getEventType(): string {
    return "interactionCreate";
  }
  getEventOccurance(): boolean {
    return false;
  }
  async execute(interaction: ButtonInteraction): Promise<void> {
    if (!interaction.isButton()) return;

    const button = this.client.buttons.get(interaction.customId);
    if (!button) return;

    try {
      await button.execute(interaction);
    } catch (err) {
      Logger.error(err);
      await interaction.reply({
        content: "There was an error while processing this button command!",
        ephemeral: true,
      });
    }
  }
}

export default ButtonInteractionCreateEvent;
