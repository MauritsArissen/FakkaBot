import { CommandInteraction, SlashCommandBuilder } from "discord.js";

interface ICommand {
	getName(): string;
	getSlashCommandBuilder(): SlashCommandBuilder;
	hasPermissions(interaction: CommandInteraction): Promise<boolean>;
	execute(interaction: CommandInteraction): Promise<any> | any;
}

export default ICommand;
