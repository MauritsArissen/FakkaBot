import { readdirSync } from "fs";
import path from "path";
import { Bot } from "../client";

export default async ({ client }: { client: Bot }) => {
  const list = ["commands", "buttons", "selects"];

  list.forEach(async (i) => {
    const files = readdirSync(
      path.join(__dirname, `../interactions/${i}`)
    ).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of files) {
      const interaction = (
        await import(path.join(__dirname, `../interactions/${i}/${file}`))
      ).default;
      client[i].set(
        i == "commands" ? interaction.data.name : interaction.customId,
        interaction
      );
    }
  });
};
