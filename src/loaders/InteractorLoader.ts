import { Bot } from "../client";
import IButton from "../interfaces/IButton";
import ICommand from "../interfaces/ICommand";
import ISelectMenu from "../interfaces/ISelectMenu";
import Logger from "../util/Logger";
import { autoInjectable, container } from "tsyringe";
import IModal from "../interfaces/IModal";
import path from "path";
import { existsSync, readdirSync } from "fs";

@autoInjectable()
class InteractorLoader {
	constructor(private client?: Bot) {}

	public load(): void {
		Logger.info("Loading interactions...");

		const folderPath = `${__dirname}/../interactors`;
		const categories = ["commands", "buttons", "selectMenus", "modals"];

		categories.forEach((category) => {
			const categoryFolderPath = path.join(folderPath, category);

			if (existsSync(categoryFolderPath)) {
				const files = readdirSync(categoryFolderPath);

				files.forEach(async (file) => {
					const filePath = path.join(categoryFolderPath, file);
					const { default: defaultExport } = await import(filePath);
					const interaction = container.resolve(defaultExport);

					switch (category) {
						case "commands":
							this.handleCommands(interaction as ICommand);
							break;
						case "buttons":
							this.handleButtons(interaction as IButton);
							break;
						case "selectMenus":
							this.handleSelectMenu(interaction as ISelectMenu);
							break;
						case "modals":
							this.handleModal(interaction as IModal);
							break;
					}
				});
			}
		});
	}

	private handleCommands(interaction: ICommand): void {
		this.client.commands.set(interaction.getName(), interaction);
	}

	private handleButtons(interaction: IButton): void {
		this.client.buttons.set(interaction.getCustomId(), interaction);
	}

	private handleSelectMenu(interaction: ISelectMenu): void {
		this.client.selectMenus.set(interaction.getCustomId(), interaction);
	}

	private handleModal(interaction: IModal): void {
		this.client.modals.set(interaction.getCustomId(), interaction);
	}
}

export default InteractorLoader;
