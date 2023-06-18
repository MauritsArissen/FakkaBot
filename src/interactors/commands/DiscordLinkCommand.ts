import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import { PrismaClient } from "@prisma/client";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { randomBytes } from "crypto";

@autoInjectable()
class DiscordLinkCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "discordlink";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription(
				"Link your discord account to your minecraft account",
			) as SlashCommandBuilder;
	}

	async hasPermissions(): Promise<boolean> {
		return true;
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const uniqueCode = randomBytes(6).toString("hex");
		const member = await interaction.guild.members.fetch(interaction.user.id);

		const link = await this.prisma.discordLink.upsert({
			where: { uid: interaction.user.id },
			create: {
				uid: interaction.user.id,
				gid: interaction.guild.id,
				code: uniqueCode,
				displayName: member.displayName,
				hexcolor: member.displayHexColor,
				uuid: "",
			},
			update: {
				code: uniqueCode,
				gid: interaction.guild.id,
				uuid: "",
			},
		});

		await interaction.reply({
			content: `# Link your account!\n\nYour unique code is: \`${link.code}\`\n\nJoin the server and type \`/link <code>\` to link your account!\n\n**Note:** Using this command again will invalidate your last code and make a new one!`,
			ephemeral: true,
		});
	}
}

export default DiscordLinkCommand;
