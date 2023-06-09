import { yellow } from "colorette";
import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import Logger from "../util/Logger";

@autoInjectable()
class StartupReady implements IEvent {
	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	execute(client: Bot): void {
		Logger.info(`Ready! Logged in as ${yellow(client.user.username)}`);
	}
}

export default StartupReady;
