import { Client, Intents, Collection } from "discord.js";
import { Logger } from "winston";
import LoggerInstance from "../loaders/logger";

class Bot extends Client {
  public logger: Logger = LoggerInstance;
  public commands: Collection<string, any> = new Collection();
  public buttons: Collection<string, any> = new Collection();
  public selects: Collection<string, any> = new Collection();
  public constructor() {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
      ],
    });
  }
}

export { Bot };
