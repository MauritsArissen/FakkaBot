import { ModalSubmitInteraction } from "discord.js";

export default interface IModal {
	getCustomId(): string;
	execute(interaction: ModalSubmitInteraction): Promise<any> | any;
}
