import {
  AnySelectMenuInteraction,
  Interaction,
  StringSelectMenuInteraction,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class SelectInteractionCreateEvent implements IEvent {
  constructor(private client?: Bot) {}

  getEventType(): string {
    return "interactionCreate";
  }

  getEventOccurance(): boolean {
    return false;
  }

  async execute(interaction: StringSelectMenuInteraction): Promise<void> {
    if (!interaction.isStringSelectMenu()) return;

    const select = this.client.selectMenus.get(interaction.customId);
    if (!select) return;

    try {
      await select.execute(interaction);
    } catch (err) {
      Logger.error(err);
      await interaction.reply({
        content: "There was an error while processing this select command!",
        ephemeral: true,
      });
    }
  }
}

export default SelectInteractionCreateEvent;
