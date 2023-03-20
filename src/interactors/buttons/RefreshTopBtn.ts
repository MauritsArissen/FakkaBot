import { PrismaClient, UserStats } from "@prisma/client";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import emojis from "../../config/emojis";
import IButton from "../../interfaces/IButton";
import LevelHelper from "../../util/LevelHelper";

@autoInjectable()
class RefreshTopBtn implements IButton {
  constructor(
    private prisma?: PrismaClient,
    private levelHelper?: LevelHelper
  ) {}

  getCustomId(): string {
    return "refreshTop";
  }

  async execute(interaction: ButtonInteraction): Promise<void> {
    const msg = await interaction.channel.messages.fetch(interaction.message);

    const stats: UserStats[] = await this.prisma.userStats.findMany({
      orderBy: {
        xp: "desc",
      },
      take: 25,
    });

    const users = await interaction.guild.members.fetch({
      user: stats.map((x) => x.uid),
    });

    const selectMenu = new StringSelectMenuBuilder()
      .setPlaceholder("Click to open!")
      .setCustomId("Blabla");

    for (let i = 0; i < stats.length; i++) {
      selectMenu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(
            `${
              users.get(stats[i].uid) != null
                ? users.get(stats[i].uid).displayName
                : "*User left*"
            }`
          )
          .setDescription(
            `Level: ${this.levelHelper.getLvl(
              stats[i]
            )} | Xp: ${this.levelHelper.getCurrentXp(
              stats[i]
            )}/${this.levelHelper.getRequiredXp(stats[i])} | Total xp: ${
              stats[i].xp
            }`
          )
          .setValue(`${stats[i].uid}`)
          .setEmoji({ id: emojis[`${i + 1}`] })
      );
    }

    const button = new ButtonBuilder()
      .setLabel("Refresh")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("refreshTop");

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu
    );

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await msg.edit({
      content: `> 📢 **The Fakka Leaderboards** 📢\n\nLast updated: <t:${Math.floor(
        Date.now() / 1000
      )}:R>`,
      components: [row, row2],
    });

    setTimeout(() => interaction.deferUpdate(), 2000);
  }
}

export default RefreshTopBtn;
