import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Container, { Inject, Service } from "typedi";
import HelpDescription from "../../entities/HelpDescription";
import ICommand from "../../entities/interfaces/ICommand";

@Service()
class ExampleCommand implements ICommand {
  constructor(
    @Inject("userStatsModel")
    private userStatsModel: Models.UserStats
  ) {}

  getHelpDescription(): HelpDescription {
    return new HelpDescription(
      "example",
      "just an default example command",
      "/example",
      "/example"
    );
  }

  getSlashCommandBuilder(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.getHelpDescription().getName())
      .setDescription(this.getHelpDescription().getDescription());
  }

  async hasPermissions(): Promise<boolean> {
    return true;
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const us = await this.userStatsModel.findOne({
      where: { uid: interaction.user.id },
    });
    interaction.reply(
      "Sup ma dude, " + interaction.user.username + ". You have xp: " + us.xp
    );
  }
}

export default ExampleCommand;
