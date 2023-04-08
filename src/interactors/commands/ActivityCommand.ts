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
    return new SlashCommandBuilder()
      .setName(this.getName())
      .setDescription("Show your or others activity over the past 14 days")
      .addUserOption((user) =>
        user.setName("user").setDescription("The user to show the activity of")
      ) as SlashCommandBuilder;
  }

  async hasPermissions(): Promise<boolean> {
    return true;
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const botUsr = await interaction.guild.members.fetch(this.client.user.id);
    const usr = interaction.options.getUser("user") || interaction.user;

    const userActivity = await this.prisma.activity.aggregate({
      where: {
        uid: usr.id,
        timestamp: { gte: new Date(Date.now() - 12096e5) },
      },
      _sum: { level: true },
    });

    const embed = new EmbedBuilder()
      .setColor(botUsr.displayHexColor)
      .setDescription(
        `${usr.id != interaction.user.id ? usr.tag : "Your"} activity tracker`
      )
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
      ephemeral: true,
    });
  }
}

export default ActivityCommand;
