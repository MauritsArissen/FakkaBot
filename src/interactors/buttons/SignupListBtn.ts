import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";
import { PrismaClient } from "@prisma/client";
import {
	ActionRowBuilder,
	ButtonInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";

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
				.map(async (signUp) => msg.channel.guild.members.fetch(signUp.uid))
		);
		const signedOff = await Promise.all(
			signUps
				.filter((signUp) => !signUp.signed)
				.map(async (signUp) => msg.channel.guild.members.fetch(signUp.uid))
		);

		const modal = new ModalBuilder()
			.setTitle("Signups")
			.setCustomId("signupListModal");

		const signedUpInput = new TextInputBuilder()
			.setCustomId("signedUpInput")
			.setLabel("Signed Up")
			.setPlaceholder(
				signedUp
					.map(
						(member) =>
							`${member.displayName || member.user.username} (${
								member.user.tag
							})`
					)
					.join("\n") || "No one"
			)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(false);

		const signedOffInput = new TextInputBuilder()
			.setCustomId("signedOffInput")
			.setLabel("Signed Off")
			.setPlaceholder(
				signedOff
					.map(
						(member) =>
							`${member.displayName || member.user.username} (${
								member.user.tag
							})`
					)
					.join("\n") || "No one"
			)
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(false);

		const firstActionRow =
			new ActionRowBuilder<TextInputBuilder>().addComponents(signedUpInput);

		const secondActionRow =
			new ActionRowBuilder<TextInputBuilder>().addComponents(signedOffInput);

		modal.addComponents(firstActionRow, secondActionRow);

		await interaction.showModal(modal);
	}
}

export default SignupListBtn;
