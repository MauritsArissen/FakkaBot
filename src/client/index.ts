import { Client, IntentsBitField, Collection } from "discord.js";
import { singleton } from "tsyringe";
import IButton from "../interfaces/IButton";
import ICommand from "../interfaces/ICommand";
import ISelectMenu from "../interfaces/ISelectMenu";

@singleton()
class Bot extends Client {
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
