import { ButtonInteraction } from "discord.js";

export default interface IButton {
  getCustomId(): string;
  execute(interaction: ButtonInteraction): Promise<any>;
}
