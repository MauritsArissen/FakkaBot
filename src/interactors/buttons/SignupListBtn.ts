import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";
import { PrismaClient } from "@prisma/client";
import { ButtonInteraction, EmbedBuilder } from "discord.js";

@autoInjectable()
class SignupListBtn implements IButton {
	constructor(private prisma?: PrismaClient) {}

	getCustomId(): string {
		return "signupList";
	}

	async execute(interaction: ButtonInteraction): Promise<void> {
		const msg = await interaction.channel.messages.fetch(interaction.message);

		const signUps = await this.prisma?.signUps.findMany({
			where: {
				mid: msg.id,
			},
		});

		const signedUp = await Promise.all(
			signUps
				.filter((signUp) => signUp.signed)
				.map(async (signUp) => msg.channel.guild.members.fetch(signUp.uid)),
		);
		const signedOff = await Promise.all(
			signUps
				.filter((signUp) => !signUp.signed)
				.map(async (signUp) => msg.channel.guild.members.fetch(signUp.uid)),
		);

		const signedUpText =
			signedUp
				.map(
					(member) =>
						`${member.displayName || member.user.username} (${member.user.tag})`,
				)
				.join("\n") || "No one";

		const signedOffText =
			signedOff
				.map(
					(member) =>
						`${member.displayName || member.user.username} (${member.user.tag})`,
				)
				.join("\n") || "No one";

		const embed = new EmbedBuilder()
			.setTitle("Sign up list")
			.addFields(
				{ name: "Signed up", value: signedUpText, inline: true },
				{ name: "Signed off", value: signedOffText, inline: true },
			)
			.setColor("Green");

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	}
}

export default SignupListBtn;
