import { readdirSync } from "fs";
import path from "path";
import { Bot } from "../client";
import IEvent from "../entities/interfaces/IEvent";
import Logger from "../util/Logger";

class EventLoader {
  private _client;
  constructor(client: Bot) {
    this._client = client;
  }

  public async load() {
    Logger.info("Loading events...");
    const eventFiles = readdirSync(path.join(__dirname, "../events")).filter(
      (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of eventFiles) {
      const event: IEvent = new (
        await import(path.join(__dirname, `../events/${file}`))
      ).default();

      event.getEventOccurance()
        ? this._client.once(event.getEventType(), (...args) =>
            event.execute(...args)
          )
        : this._client.on(event.getEventType(), (...args) =>
            event.execute(...args)
          );
    }
  }
}

export default EventLoader;
