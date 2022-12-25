import { ButtonInteraction } from "discord.js";
import Container from "typedi";
import { Bot } from "../../client";
import Logger from "../../util/Logger";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const client: Bot = Container.get("client");

    const button = client.buttons.get(interaction.customId);

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
  },
};
