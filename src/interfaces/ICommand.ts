import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface ICommand {
  getName(): string;
  getSlashCommandBuilder(): SlashCommandBuilder;
  hasPermissions(): Promise<boolean>;
  execute(interaction: CommandInteraction): Promise<any> | any;
}
