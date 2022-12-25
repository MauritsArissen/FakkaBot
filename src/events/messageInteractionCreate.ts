import { red, yellow } from "colorette";
import { CommandInteraction } from "discord.js";
import Container from "typedi";
import { Bot } from "../client";
import Logger from "../util/Logger";

export default {
  name: "interactionCreate",
  once: false,
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const client: Bot = Container.get("client");

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      Logger.log(
        `${interaction.user.tag} used command ${yellow(
          "/" + interaction.commandName
        )}`,
        "COMMAND",
        JSON.stringify(interaction.options)
      );
      await command.execute(interaction);
    } catch (err) {
      Logger.error(
        red(
          `There was an error whilst executing /${
            interaction.commandName
          } ${yellow("Interactor: " + interaction.user.username)}`
        ),
        err
      );
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
