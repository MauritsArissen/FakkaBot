import axios from "axios";
import {
  SlashCommandBuilder,
  CommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../../client";
import ICommand from "../../interfaces/ICommand";
import TimeHelper from "../../util/TimeHelper";

@autoInjectable()
class InfoCommand implements ICommand {
  constructor(private client?: Bot) {}

  getName(): string {
    return "info";
  }

  getSlashCommandBuilder(): SlashCommandBuilder {
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName(this.getName());
    slashCommand.setDescription("Get some bot info");

    return slashCommand;
  }

  async hasPermissions(): Promise<boolean> {
    return true;
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const botUsr = await interaction.guild.members.fetch(this.client.user.id);
    const response = await axios.get(
      "https://api.github.com/repos/MauritsArissen/FakkaBot/contributors"
    );

    const embed = new EmbedBuilder()
      .setColor(botUsr.displayHexColor)
      .setAuthor({
        name: `${this.client.user.username} bot info`,
        iconURL: this.client.user.avatarURL(),
      })
      .setThumbnail(this.client.user.avatarURL())
      .addFields(
        {
          name: "Uptime",
          value: TimeHelper.millisecondToTimeFormat(this.client.uptime),
          inline: true,
        },
        {
          name: "Contributers",
          value: response.data
            .map((x) => `[${x["login"]}](${x["html_url"]})`)
            .join("\n"),
          inline: true,
        },
        {
          name: "Contribute?",
          value: `Open a PR [here](https://github.com/MauritsArissen/FakkaBot/pulls)!`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Made for the best group ever ❤️" });

    interaction.reply({ embeds: [embed] });
  }
}

export default InfoCommand;
