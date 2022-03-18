import { SelectMenuInteraction } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: SelectMenuInteraction) {
    if (!interaction.isSelectMenu()) return;

    const client: Bot = Container.get("client");

    const select = client.selects.get(interaction.customId);

    if (!select) return;

    try {
      await select.execute(interaction);
    } catch (err) {
      client.logger.error(err);
      await interaction.reply({
        content: "There was an error while processing this select command!",
        ephemeral: true,
      });
    }
  },
};
