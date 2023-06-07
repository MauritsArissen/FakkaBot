import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { PrismaClient } from "@prisma/client";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Message,
	Role,
} from "discord.js";

@autoInjectable()
class PingRoleSentEvent implements IEvent {
	constructor(private prisma?: PrismaClient) {}

	getEventType(): string {
		return "messageCreate";
	}

	getEventOccurance(): boolean {
		return false;
	}

	async execute(message: Message): Promise<void> {
		if (message.author.bot) return;

		let pingRole: Role;

		for (const role of message.mentions.roles) {
			const dbRole = await this.prisma?.pingRole.findFirst({
				where: {
					rid: role[1].id,
				},
			});

			if (dbRole) {
				pingRole = await message.guild.roles.fetch(dbRole.rid);
				break;
			}
		}

		if (!pingRole) return;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: message.author.username,
				iconURL: message.author.avatarURL(),
			})
			.setDescription(message.content)
			.setColor(pingRole.color);

		const yesButton = new ButtonBuilder()
			.setCustomId("signupYes")
			.setLabel("Sign up")
			.setStyle(ButtonStyle.Success);

		const noButton = new ButtonBuilder()
			.setCustomId("signupNo")
			.setLabel("Sign off")
			.setStyle(ButtonStyle.Danger);

		const listButton = new ButtonBuilder()
			.setCustomId("signupList")
			.setLabel("List")
			.setStyle(ButtonStyle.Secondary);

		const buttonRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
			yesButton,
			noButton,
			listButton,
		);

		await message.delete();
		await message.channel.send({
			content: pingRole.toString(),
			embeds: [embed],
			components: [buttonRow],
		});
	}
}

export default PingRoleSentEvent;
