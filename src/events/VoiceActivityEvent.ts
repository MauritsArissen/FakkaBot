import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import LevelHelper from "../util/LevelHelper";

@autoInjectable()
class VoiceActivityEvent implements IEvent {
	constructor(private levelHelper?: LevelHelper) {}

	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	async execute(client: Bot): Promise<void> {
		this.loop(client);
	}

	async loop(client: Bot) {
		const guilds = await client.guilds.cache;
		guilds.forEach(async (guild) => {
			const members = await guild.members.cache.filter(
				(member) =>
					member.voice.channel != null &&
          member.voice.channelId != guild.afkChannelId &&
          member.voice.channel.members.size > 1 &&
          !member.voice.selfMute &&
          !member.user.bot,
			);
			members.forEach((m) =>
				this.levelHelper.addXp(
					m.id,
					Math.round(Math.random() * 10 + 20),
					2 * 60,
				),
			);
		});
		setTimeout(() => this.loop(client), 10 * 1000);
	}
}

export default VoiceActivityEvent;
