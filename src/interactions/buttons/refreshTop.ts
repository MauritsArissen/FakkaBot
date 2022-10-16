import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, SelectMenuBuilder, SelectMenuOptionBuilder } from "discord.js";
import emojis from "../../config/emojis";
import UserStats from "../../models/UserStats.model";
import LevelHelper from "../../util/LevelHelper";

export default {
  customId: "refreshTop",
  async execute(interaction: ButtonInteraction) {
    const msg = await interaction.channel.messages.fetch(interaction.message);
    
    const stats: UserStats[] = await UserStats.findAll({ order: [['xp', 'DESC']], limit: 40 });
    const users = await interaction.guild.members.fetch({ user: stats.map(x => x.uid)});

    const selectMenu = new SelectMenuBuilder()
        .setPlaceholder("Click to open!")
        .setCustomId("Blabla")

    for (let i = 0; i < stats.length; i++) {
        selectMenu.addOptions(new SelectMenuOptionBuilder()
            .setLabel(`${users.get(stats[i].uid).displayName}`)
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
    
    await msg.edit({
        content: `> 📢 **The Fakka Leaderboards** 📢\n\nLast updated: <t:${Math.floor(Date.now()/1000)}:R>`,
        components: [row, row2]
    });

    interaction.deferUpdate();
  },
};
