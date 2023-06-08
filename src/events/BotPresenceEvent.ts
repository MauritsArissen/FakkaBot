import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";

class BotPresenceEvent implements IEvent {
	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	execute(client: Bot): void {
		client.user.setPresence({
			activities: [
				{
					name: "nooothing...",
				},
			],
		});
	}
}

export default BotPresenceEvent;
