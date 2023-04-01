import { PrismaClient } from "@prisma/client";
import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import TimeHelper from "../../util/TimeHelper";
import { Bot } from "../../client";

@autoInjectable()
class ActivityCommand implements ICommand {
  constructor(private prisma?: PrismaClient, private client?: Bot) {}

  getName(): string {
    return "activity";
  }

  getSlashCommandBuilder(): SlashCommandBuilder {
    const slashCommand = new SlashCommandBuilder();

    slashCommand.setName(this.getName());
    slashCommand.setDescription("Show your activity over the past 14 days");

    return slashCommand;
  }

  async hasPermissions(): Promise<boolean> {
    return true;
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const botUsr = await interaction.guild.members.fetch(this.client.user.id);

    const userActivity = await this.prisma.activity.aggregate({
      where: {
        uid: interaction.user.id,
        timestamp: { gte: new Date(Date.now() - 12096e5) },
      },
      _sum: { level: true },
    });

    const embed = new EmbedBuilder()
      .setColor(botUsr.displayHexColor)
      .setDescription("Your activity tracker")
      .addFields(
        {
          name: "Past 14 days",
          value: TimeHelper.minuteToTimeFormat(
            userActivity._sum.level
          ).toString(),
        },
        {
          name: "Average per day",
          value: TimeHelper.minuteToTimeFormat(
            userActivity._sum.level / 14
          ).toString(),
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  }
}

export default ActivityCommand;
