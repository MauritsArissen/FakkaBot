import { StringSelectMenuInteraction } from "discord.js";

export default interface ISelectMenu {
  getCustomId(): string;
  execute(interaction: StringSelectMenuInteraction): Promise<any> | any;
}
