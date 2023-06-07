import { ModalSubmitInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class ModalSubmitInteractionEvent implements IEvent {
	constructor(private client?: Bot) {}

	getEventType(): string {
		return "interactionCreate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(interaction: ModalSubmitInteraction): Promise<void> {
		if (!interaction.isModalSubmit()) return;

		const modal = this.client.modals.get(interaction.customId);
		if (!modal) return;

		try {
			await modal.execute(interaction);
		}
		catch (err) {
			Logger.error(err);
			await interaction.reply({
				content: "There was an error while processing this select command!",
				ephemeral: true,
			});
		}
	}
}

export default ModalSubmitInteractionEvent;
