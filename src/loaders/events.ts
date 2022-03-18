import { readdirSync } from "fs";
import path from "path";
import { Bot } from "../client";

export default async ({ client }: { client: Bot }) => {
  const eventFiles = readdirSync(path.join(__dirname, "../events")).filter(
    (file) => file.endsWith(".ts") || file.endsWith(".js")
  );

  for (const file of eventFiles) {
    const event = (await import(path.join(__dirname, `../events/${file}`)))
      .default;

    event.once
      ? client.once(event.name, (...args) => event.execute(...args))
      : client.on(event.name, (...args) => event.execute(...args));
  }
};
