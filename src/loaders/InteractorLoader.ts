import Container from "typedi";
import { Bot } from "../client";
import IButton from "../entities/interfaces/IButton";
import ICommand from "../entities/interfaces/ICommand";
import ISelectMenu from "../entities/interfaces/ISelectMenu";
import interactionsConfig from "../config/interactions";

class InteractorLoader {
  private client: Bot;

  constructor(client: Bot) {
    this.client = client;
  }

  public load(): void {
    const list = Object.keys(interactionsConfig).map((x) => x);

    list.forEach(async (category) => {
      const interactions = interactionsConfig[category];

      for (const x of interactions) {
        const interaction = Container.get(x);

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
    this.client.commands.set(
      interaction.getHelpDescription().getName(),
      interaction
    );
  }

  private handleButtons(interaction: IButton): void {
    this.client.buttons.set(interaction.getCustomId(), interaction);
  }

  private handleSelectMenu(interaction: ISelectMenu): void {
    this.client.selectMenus.set(interaction.getCustomId(), interaction);
  }
}

export default InteractorLoader;
