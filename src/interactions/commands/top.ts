import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, SelectMenuBuilder, SelectMenuOptionBuilder, SlashCommandBuilder } from "discord.js";
import LevelHelper from "../../util/LevelHelper";
import UserStats from "../../models/UserStats.model";
import emojis from "../../config/emojis";

export default {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Show leaderboard"),
    async execute(interaction: CommandInteraction) {
        const stats: UserStats[] = await UserStats.findAll({ order: [['xp', 'DESC']], limit: 25 });
        const users = await interaction.guild.members.fetch({ user: stats.map(x => x.uid)});

        const selectMenu = new SelectMenuBuilder()
            .setPlaceholder("Click to open!")
            .setCustomId("Blabla")

        for (let i = 0; i < stats.length; i++) {
            selectMenu.addOptions(new SelectMenuOptionBuilder()
                .setLabel(`${users.get(stats[i].uid) != null ? users.get(stats[i].uid).displayName : "*User left*"}`)
                .setDescription(`Level: ${LevelHelper.getLvl(stats[i])} | Xp: ${LevelHelper.getCurrentXp(stats[i])}/${LevelHelper.getRequiredXp(stats[i])} | Total xp: ${stats[i].xp}`)
                .setValue(`${stats[i].uid}`)
                .setEmoji({ id: emojis[`${i+1}`] })
            );
        }
        
        const button = new ButtonBuilder()
            .setLabel("Refresh")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("refreshTop");
            
        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(selectMenu);

        const row2 = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(button)
        
        await interaction.reply({
            content: `> 📢 **The Fakka Leaderboards** 📢\n\nLast updated: <t:${Math.floor(Date.now()/1000)}:R>`,
            components: [row, row2]
        });
        
    }
}