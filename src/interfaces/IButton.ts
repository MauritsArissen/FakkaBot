import { ButtonInteraction } from "discord.js";

interface IButton {
	getCustomId(): string;
	execute(interaction: ButtonInteraction): Promise<any> | any;
}

export default IButton;
