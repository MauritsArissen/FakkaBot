import { PrismaClient } from "@prisma/client";
import { ButtonInteraction } from "discord.js";
import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";

@autoInjectable()
class PingRoleAssignBtn implements IButton {
	constructor(private prisma?: PrismaClient) {}

	getCustomId(): string {
		return "pingRoleAssign";
	}

	async execute(interaction: ButtonInteraction): Promise<any> {
		const pingRole = await this.prisma.pingRole.findFirst({
			where: {
				mid: interaction.message.id,
			},
		});

		if (!pingRole) return interaction.deferUpdate();

		const member = await interaction.guild.members.fetch(interaction.user.id);

		if (!member.roles.cache.has(pingRole.rid)) {
			await member.roles.add(pingRole.rid);
			await interaction.reply({
				content: `You have been assigned the <@&${pingRole.rid}> role.`,
				ephemeral: true,
			});
		} else {
			await member.roles.remove(pingRole.rid);
			await interaction.reply({
				content: `You have been unassigned the <@&${pingRole.rid}> role.`,
				ephemeral: true,
			});
		}
	}
}

export default PingRoleAssignBtn;
