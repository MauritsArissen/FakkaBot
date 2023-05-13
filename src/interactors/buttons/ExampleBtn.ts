import { ButtonInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";

@autoInjectable()
class ExampleBtn implements IButton {
	getCustomId(): string {
		return "exampleBtn";
	}
	execute(interaction: ButtonInteraction): void {
		interaction.deferUpdate();
	}
}

export default ExampleBtn;
