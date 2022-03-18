import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import Container from "typedi";

export default {
  data: new SlashCommandBuilder()
    .setName("pings")
    .setDescription("Places down the pings")
    .setDefaultPermission(false),
  permissions: [
    {
      id: "244909794836611082",
      type: "USER",
      permission: true,
    },
  ],
  async execute(interaction: CommandInteraction) {
    const pingRoleModel: Models.PingRole = Container.get("pingRoleModel");
    const list = await pingRoleModel.findAll();

    const optionList = list.map((x) => {
      return {
        label: x.label,
        description: x.description,
        value: x.value,
        emoji: x.emoji,
      };
    });

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("pingsSelect")
        .setPlaceholder("Nothing selected")
        .setMinValues(0)
        .setMaxValues(optionList.length)
        .addOptions(optionList)
    );

    await interaction.reply({ content: "Placed", ephemeral: true });
    await interaction.channel.send({
      content:
        "`🔔` **Selecteer ping roles**\n\nOpen de select box en selecteer de games waarvan je pings wil ontvangen. Je kan er meerdere selecteren.",
      components: [row],
    });
  },
};
