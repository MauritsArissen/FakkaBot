import { autoInjectable } from "tsyringe";
import IButton from "../../interfaces/IButton";
import { PrismaClient } from "@prisma/client";
import { ButtonInteraction } from "discord.js";

@autoInjectable()
class SignupYesBtn implements IButton {
	constructor(private prisma?: PrismaClient) {}

	getCustomId(): string {
		return "signupYes";
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
				signed: true,
			},
			update: {
				signed: true,
			},
		});

		interaction.reply({
			content: "You signed up",
			ephemeral: true,
		});
	}
}

export default SignupYesBtn;
