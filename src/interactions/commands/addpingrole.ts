import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Container from "typedi";
import config from "../../config";
import { IPingRole } from "../../interfaces/IPingRole";
import PingsUtil from "../../util/PingsUtil";

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
      id: config.botModRoleId,
      type: "ROLE",
      permission: true,
    },
  ],
  async execute(interaction: CommandInteraction) {
    const pingRoleModel: Models.PingRole = Container.get("pingRoleModel");

    const dto: IPingRole = {
      label: interaction.options.getString("label"),
      value: interaction.options.getString("label").replace(/\s+/g, ""),
      description: interaction.options.getString("description"),
      emoji: interaction.options.getString("emoji"),
      roleId: interaction.options.getRole("role").id,
    };

    pingRoleModel.create(dto);

    interaction.reply({
      content: "Ping role was added!",
      ephemeral: true,
    });

    PingsUtil.updateMessage(interaction.guild);
  },
};
