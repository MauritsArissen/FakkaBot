import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import Container from "typedi";
import { Bot } from "../../client";
import TimeHelper from "../../util/TimeHelper";

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get some bot info"),
  async execute(interaction: CommandInteraction) {
    const client: Bot = Container.get("client");
    const botUsr = await interaction.guild.members.fetch(client.user.id);

    const embed = new EmbedBuilder()
      .setColor(botUsr.displayHexColor)
      .setAuthor({ name: `${client.user.username} bot info`, iconURL: client.user.avatarURL() })
      .setThumbnail(client.user.avatarURL())
      .addFields(
        { name: "Uptime", value: TimeHelper.millisecondToTimeFormat(client.uptime), inline: true },
        { name: "Contributers", value: `<@244909794836611082>`, inline: true },
        { name: "Contribute?", value: `Open a PR [here](https://github.com/MauritsArissen/FakkaBot/pulls)!`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Made for the best group ever ❤️" })

    interaction.reply({embeds: [embed]});
  }
}