import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Container from "typedi";
import { IPingRole } from "../../interfaces/IPingRole";

export default {
  data: new SlashCommandBuilder()
    .setName("addpingrole")
    .setDescription("Add a ping role")
    .setDefaultPermission(false)
    .addStringOption((options) =>
      options
        .setName("label")
        .setRequired(true)
        .setDescription("Label as shown in scroll list")
    )
    .addStringOption((options) =>
      options
        .setName("value")
        .setRequired(true)
        .setDescription("Backend value for display")
    )
    .addStringOption((options) =>
      options
        .setName("description")
        .setRequired(true)
        .setDescription("Descripion of the role")
    )
    .addStringOption((options) =>
      options
        .setName("emoji")
        .setRequired(true)
        .setDescription("Emoji that fits the role")
    )
    .addRoleOption((options) =>
      options.setName("role").setRequired(true).setDescription("The ping role")
    ),
  permissions: [
    {
      id: "244909794836611082",
      type: "USER",
      permission: true,
    },
  ],
  async execute(interaction: CommandInteraction) {
    const pingRoleModel: Models.PingRole = Container.get("pingRoleModel");

    const dto: IPingRole = {
      label: interaction.options.getString("label"),
      value: interaction.options.getString("value"),
      description: interaction.options.getString("description"),
      emoji: interaction.options.getString("emoji"),
      roleId: interaction.options.getRole("role").id,
    };

    pingRoleModel.create(dto);

    interaction.reply({
      content: "🟩 Ping role was added!",
      ephemeral: true,
    });
  },
};
