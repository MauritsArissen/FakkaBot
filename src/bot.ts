import "reflect-metadata";
import { Bot } from "./client";
import config from "./config";
import loaders from "./loaders";
import { container } from "tsyringe";

async function startBot() {
	const client = container.resolve(Bot);
	await loaders();
	client.login(config.token);
}

startBot();
