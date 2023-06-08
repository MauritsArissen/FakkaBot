import { StringSelectMenuInteraction } from "discord.js";

interface ISelectMenu {
	getCustomId(): string;
	execute(interaction: StringSelectMenuInteraction): Promise<any> | any;
}

export default ISelectMenu;
