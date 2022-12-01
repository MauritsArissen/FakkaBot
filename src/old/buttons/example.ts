import { ButtonInteraction } from "discord.js";

export default {
  customId: "exampleBtn",
  async execute(interaction: ButtonInteraction) {
    interaction.deferUpdate();
  },
};
