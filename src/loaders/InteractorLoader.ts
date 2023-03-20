import { Bot } from "../client";
import IButton from "../interfaces/IButton";
import ICommand from "../interfaces/ICommand";
import ISelectMenu from "../interfaces/ISelectMenu";
import Logger from "../util/Logger";
import { autoInjectable, container } from "tsyringe";
import dependencyInjection from "../config/dependencyInjection";

@autoInjectable()
class InteractorLoader {
  constructor(private client?: Bot) {}

  public load(): void {
    Logger.info("Loading interactions...");

    const list = Object.keys(dependencyInjection).map((x) => x);

    list.forEach(async (category) => {
      const interactions = dependencyInjection[category];

      for (const x of interactions) {
        const interaction = container.resolve(x);

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
        }
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
}

export default InteractorLoader;
