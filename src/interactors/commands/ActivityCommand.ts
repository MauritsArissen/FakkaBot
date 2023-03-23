import { PrismaClient } from "@prisma/client";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import TimeHelper from "../../util/TimeHelper";

@autoInjectable()
class ActivityCommand implements ICommand {
  constructor(private prisma?: PrismaClient) {}

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
    const userActivity = await this.prisma.activity.aggregate({
      where: {
        uid: interaction.user.id,
        timestamp: { gte: new Date(Date.now() - 12096e5) },
      },
      _sum: { level: true },
    });

    interaction.reply({
      content: `Your activity over the past 14 days was a total of: **${TimeHelper.minuteToTimeFormat(
        userActivity._sum.level
      )}**`,
      ephemeral: true,
    });
  }
}

export default ActivityCommand;
