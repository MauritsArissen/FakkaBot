import { ActionRowBuilder, APISelectMenuOption, CommandInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, SlashCommandBuilder } from "discord.js";
import LevelHelper from "../../util/LevelHelper";
import UserStats from "../../models/UserStats.model";

export default {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Show leaderboard"),
    async execute(interaction: CommandInteraction) {
        const stats: UserStats[] = await UserStats.findAll({ order: [['xp', 'DESC']], limit: 15 });
        const users = await interaction.guild.members.fetch({ user: stats.map(x => x.uid)});

        const selectMenu = new SelectMenuBuilder()
            .setPlaceholder("Click to open!")
            .setCustomId("Blabla")
            .addOptions(stats.map(x => {
                return new SelectMenuOptionBuilder()
                    .setLabel(`${users.get(x.uid).displayName}`)
                    .setDescription(`Level: ${LevelHelper.getLvl(x)} | Xp: ${LevelHelper.getCurrentXp(x)}/${LevelHelper.getRequiredXp(x)} | Total xp: ${x.xp}`)
                    .setValue(`${x.uid}`)
                    .setEmoji('🔸')
            }));
        
        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(selectMenu);
        
        await interaction.reply({
            content: `📢 **Fakka Top 15**\n*Click on the select menu to open the leaderboard, ordered the best 15 from top to bottom*`,
            components: [row]
        })
        
    }
}