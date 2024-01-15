import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import { PrismaClient, UserStats } from "@prisma/client";
import {
	CommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";

@autoInjectable()
class WrappedCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "wrapped";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Wrapped command") as SlashCommandBuilder;
	}

	async hasPermissions(): Promise<boolean> {
		return true;
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const us: UserStats = await this.prisma.userStats.findUnique({
			where: { uid: interaction.user.id },
		});

		if (!us) {
			return interaction.reply({
				content:
					"Je hebt niet in call gezeten of gepraat in een voice channel in 2023",
				ephemeral: true,
			});
		}

		const data = await this.prisma.activity.aggregate({
			where: {
				uid: interaction.user.id,
				timestamp: {
					gte: new Date("2023-01-01T00:00:00.000Z"),
					lte: new Date("2023-12-31T23:59:59.999Z"),
				},
			},
			_sum: {
				level: true,
			},
		});

		const minutes = data._sum.level;
		const hours = minutes / 60;
		const days = hours / 24;

		const member = await interaction.guild.members.fetch(interaction.user.id);
		const embed = new EmbedBuilder()
			.setColor(member.displayColor)
			.setAuthor({
				name: `${member.displayName}'s wrapped 2023!`,
				iconURL: member.user.displayAvatarURL(),
			})
			.addFields(
				{
					name: "Minuten",
					value: `${minutes}`,
					inline: true,
				},
				{
					name: hours > 1 ? "Uren" : "Uur",
					value: `${hours.toFixed(2)}`,
					inline: true,
				},
				{
					name: days > 1 ? "Dagen" : "Dag",
					value: `${days.toFixed(2)}`,
					inline: true,
				},
			)
			.setThumbnail(member.user.displayAvatarURL());

		await interaction.reply({
			embeds: [embed],
		});
	}
}

export default WrappedCommand;
