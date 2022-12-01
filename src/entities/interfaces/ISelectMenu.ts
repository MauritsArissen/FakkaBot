import { SelectMenuInteraction } from "discord.js";

export default interface ISelectMenu {
  getCustomId(): string;
  execute(interaction: SelectMenuInteraction): Promise<any>;
}
