import DatabaseLoader from "./DatabaseLoader";
import InteractorLoader from "./InteractorLoader";
import EventLoader from "./EventLoader";
import Logger from "../util/Logger";
import { green } from "colorette";

export default async () => {
	Logger.info("STARTING APPLICATION!");
	await new DatabaseLoader().load();
	new InteractorLoader().load();
	await new EventLoader().load();
	await Logger.info(green("Successfully ran all loaders!"));
};
