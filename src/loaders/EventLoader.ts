import { readdirSync } from "fs";
import path from "path";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class EventLoader {
	constructor(private client?: Bot) {}

	public async load() {
		Logger.info("Loading events...");
		const eventFiles = readdirSync(path.join(__dirname, "../events")).filter(
			(file) => file.endsWith(".ts") || file.endsWith(".js"),
		);

		for (const file of eventFiles) {
			const event: IEvent = new (
				await import(path.join(__dirname, `../events/${file}`))
			).default();

			event.getEventOccurance()
				? this.client.once(event.getEventType(), (...args) =>
					event.execute(...args),
				)
				: this.client.on(event.getEventType(), (...args) =>
					event.execute(...args),
				);
		}
	}
}

export default EventLoader;
