import { Client, IntentsBitField, Collection } from "discord.js";
import IButton from "../entities/interfaces/IButton";
import ICommand from "../entities/interfaces/ICommand";
import ISelectMenu from "../entities/interfaces/ISelectMenu";

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
