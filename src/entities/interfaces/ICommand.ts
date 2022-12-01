import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import HelpDescription from "../HelpDescription";

export default interface ICommand {
  getHelpDescription(): HelpDescription;
  getSlashCommandBuilder(): SlashCommandBuilder;
  hasPermissions(): Promise<boolean>;
  execute(interaction: CommandInteraction): Promise<any>;
}
