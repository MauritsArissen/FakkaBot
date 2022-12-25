import { Client, IntentsBitField, Collection } from "discord.js";

class Bot extends Client {
  public commands: Collection<string, any> = new Collection();
  public buttons: Collection<string, any> = new Collection();
  public selects: Collection<string, any> = new Collection();
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
