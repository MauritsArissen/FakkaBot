import { Message } from "discord.js";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import LevelHelper from "../util/LevelHelper";

@autoInjectable()
class MessageCreateXpEvent implements IEvent {
	constructor(private levelHelper?: LevelHelper, private client?: Bot) {}

	getEventType(): string {
		return "messageCreate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(message: Message): Promise<void> {
		if (message.author.bot) return;
		if (
			!this.client.xpCooldown.has(message.author.id) ||
      this.client.xpCooldown.get(message.author.id) < Date.now()
		) {
			this.levelHelper.addXp(
				message.author.id,
				Math.round(Math.random() * 10 + 15),
				60,
			);
		}
	}
}

export default MessageCreateXpEvent;
