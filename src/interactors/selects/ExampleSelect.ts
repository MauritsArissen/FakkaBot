import { StringSelectMenuInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import ISelectMenu from "../../interfaces/ISelectMenu";

@autoInjectable()
class ExampleSelect implements ISelectMenu {
	getCustomId(): string {
		return "exampleSelect";
	}

	execute(interaction: StringSelectMenuInteraction): void {
		interaction.deferUpdate();
	}
}

export default ExampleSelect;
