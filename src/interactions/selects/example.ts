import { SelectMenuInteraction } from "discord.js";

export default {
  customId: "exampleSelect",
  async execute(interaction: SelectMenuInteraction) {
    interaction.deferUpdate();
  },
};
