import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("example")
        .setDescription("example command"),
    async execute(interaction: CommandInteraction) {
        interaction.deferReply();
    }
}