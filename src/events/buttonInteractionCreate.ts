import { red, yellow } from "colorette";
import { ButtonInteraction } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    const client: Bot = Container.get("client");

    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    try {
      Logger.log(
        `${interaction.user.tag} interacted with button ${yellow(
          interaction.customId
        )}`,
        "BUTTON"
      );
      await button.execute(interaction);
    } catch (err) {
      Logger.error(
        red(
          `There was an error whilst interacting with button ${
            interaction.customId
          } ${yellow("Interactor: " + interaction.user.username)}`
        ),
        err
      );
      await interaction.reply({
        content: "There was an error while processing this button command!",
        ephemeral: true,
      });
    }
  },
};
