import { red, yellow } from "colorette";
import { SelectMenuInteraction } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: SelectMenuInteraction) {
    if (!interaction.isSelectMenu()) return;

    const client: Bot = Container.get("client");

    const select = client.selects.get(interaction.customId);

    if (!select) return;

    try {
      Logger.log(
        `${interaction.user.tag} interacted with select box ${yellow(
          interaction.customId
        )}`,
        "SELECT",
        JSON.stringify(interaction.values)
      );
      await select.execute(interaction);
    } catch (err) {
      Logger.error(
        red(
          `There was an error whilst interacting with select box ${
            interaction.customId
          } ${yellow("Interactor: " + interaction.user.username)}`
        ),
        err
      );
      await interaction.reply({
        content: "There was an error while processing this select command!",
        ephemeral: true,
      });
    }
  },
};
