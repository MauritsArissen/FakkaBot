import { Client, IntentsBitField, Collection } from "discord.js";
import { Logger } from "winston";
import IButton from "../entities/interfaces/IButton";
import ICommand from "../entities/interfaces/ICommand";
import ISelectMenu from "../entities/interfaces/ISelectMenu";
import LoggerInstance from "../loaders/logger";

class Bot extends Client {
  public logger: Logger = LoggerInstance;
  public commands: Collection<string, ICommand> = new Collection();
  public buttons: Collection<string, IButton> = new Collection();
  public selectMenus: Collection<string, ISelectMenu> = new Collection();
  public xpCooldown: Collection<string, number> = new Collection();
  public constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates,
      ],
    });
  }
}

export { Bot };
