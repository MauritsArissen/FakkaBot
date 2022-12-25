import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("example")
    .setDescription("example command")
    .addUserOption((option) =>
      option.setName("usr").setDescription("the desc")
    ),
  async execute(interaction: CommandInteraction) {
    interaction.deferReply();
  },
};
