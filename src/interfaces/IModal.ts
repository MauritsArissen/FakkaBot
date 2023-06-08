import { ModalSubmitInteraction } from "discord.js";

interface IModal {
	getCustomId(): string;
	execute(interaction: ModalSubmitInteraction): Promise<any> | any;
}

export default IModal;
