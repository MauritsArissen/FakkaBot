import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";
import { PrismaClient } from "@prisma/client";
import { ButtonInteraction } from "discord.js";

@autoInjectable()
class SignupNoBtn implements IButton {
	constructor(private prisma?: PrismaClient) {}

	getCustomId(): string {
		return "signupNo";
	}

	async execute(interaction: ButtonInteraction): Promise<void> {
		const msg = await interaction.channel.messages.fetch(interaction.message);

		await this.prisma.signUps.upsert({
			where: {
				uid_mid: {
					uid: interaction.user.id,
					mid: msg.id,
				},
			},
			create: {
				uid: interaction.user.id,
				mid: msg.id,
				signed: false,
			},
			update: {
				signed: false,
			},
		});

		interaction.reply({
			content: "You signed off",
			ephemeral: true,
		});
	}
}

export default SignupNoBtn;
