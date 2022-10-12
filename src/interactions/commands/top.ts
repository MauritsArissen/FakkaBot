import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import LevelHelper from "../../util/LevelHelper";
import UserStats from "../../models/UserStats.model";

export default {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("Show leaderboard"),
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id != '244909794836611082') return interaction.deferReply();

        setTimeout(() => loop(interaction), 1000);
        
        interaction.reply({
            content: `Sent!`
        })
    }
}

const loop = async (interaction: CommandInteraction) => {
    const stats: UserStats[] = await UserStats.findAll({ order: [['xp', 'DESC']], limit: 10 });
    const users = await interaction.guild.members.fetch({ user: stats.map(x => x.uid)});
    const data = stats.map(x => { 
        return { 
            uid: users.get(x.uid).displayName, 
            currentXp: LevelHelper.getCurrentXp(x),
            remainingXp: LevelHelper.getRequiredXp(x),
            level: LevelHelper.getLvl(x)
        }
    });
    const dataString = data.map(x => `[ ${x.uid} ]\nLevel: ${x.level} | Xp: ${x.currentXp} / ${x.remainingXp}`).join("\n\n");
    interaction.editReply(`\`\`\`ini\n${dataString}\n\`\`\``)
    setTimeout(() => loop(interaction), 20000);
}