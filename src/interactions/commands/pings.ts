import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import Container from "typedi";
import config from "../../config";
import PingsUtil from "../../util/PingsUtil";

export default {
  data: new SlashCommandBuilder()
    .setName("pings")
    .setDescription("Places down the pings")
    .setDefaultPermission(false),
  permissions: [
    {
      id: config.botModRoleId,
      type: "ROLE",
      permission: true,
    },
  ],
  async execute(interaction: CommandInteraction) {
    await interaction.reply({ content: "Placed", ephemeral: true });
    const reply = await interaction.channel.send({
      content:
        "`🔔` **Selecteer ping roles**\n\nOpen de select box en selecteer de games waarvan je pings wil ontvangen. Je kan er meerdere selecteren.",
      components: [await PingsUtil.pingSelectMenuRow()],
    });

    const configModel: Models.Config = Container.get("configModel");
    [
      ["Channel", reply.channelId],
      ["Message", reply.id],
    ].forEach(async (x) => {
      let configRecord = await configModel.findOne({
        where: { key: `rolePings${x[0]}Id` },
      });
      if (!configRecord) {
        await configModel.create({ key: `rolePings${x[0]}Id`, value: x[1] });
      } else {
        await configModel.update(
          { value: x[1] },
          { where: { key: `rolePings${x[0]}Id` } }
        );
      }
    });
  },
};
