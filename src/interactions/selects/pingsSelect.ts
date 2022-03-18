import { GuildMember, SelectMenuInteraction } from "discord.js";
import Container from "typedi";

export default {
  customId: "pingsSelect",
  async execute(interaction: SelectMenuInteraction) {
    const pingRoleModel: Models.PingRole = Container.get("pingRoleModel");
    const list = await pingRoleModel.findAll();
    const member = interaction.member as GuildMember;

    const pingSepRole = await interaction.guild.roles.fetch(
      "954094322024853557"
    );

    if (pingSepRole) {
      if (interaction.values.length > 0) {
        if (!member.roles.cache.has(pingSepRole.id))
          member.roles.add(pingSepRole);
      } else {
        if (member.roles.cache.has(pingSepRole.id))
          member.roles.remove(pingSepRole);
      }
    }

    list.forEach(async (item) => {
      const role = await interaction.guild.roles.fetch(item.roleId);
      if (role) {
        if (interaction.values.includes(item.value)) {
          if (!member.roles.cache.has(role.id)) member.roles.add(role);
        } else {
          if (member.roles.cache.has(role.id)) member.roles.remove(role);
        }
      }
    });

    await interaction.deferUpdate();
  },
};
