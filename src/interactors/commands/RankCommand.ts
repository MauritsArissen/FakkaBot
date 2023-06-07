import { PrismaClient, UserStats } from "@prisma/client";
import { Rank } from "canvacord";
import {
	SlashCommandBuilder,
	CommandInteraction,
	AttachmentBuilder,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import LevelHelper from "../../util/LevelHelper";

@autoInjectable()
class RankCommand implements ICommand {
	constructor(
    private prisma?: PrismaClient,
    private levelHelper?: LevelHelper,
	) {}

	getName(): string {
		return "rank";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Show your or somebody elses ranking")
			.addUserOption((user) =>
				user
					.setName("user")
					.setDescription("The user you wanna see the stats of"),
			) as SlashCommandBuilder;
	}

	async hasPermissions(): Promise<boolean> {
		return true;
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const usr = interaction.options.getUser("user") || interaction.user;
		const us: UserStats = await this.prisma.userStats.findUnique({
			where: { uid: usr.id },
		});
		if (!us) {
			return interaction.reply({
				content: "This user does not have a profile",
				ephemeral: true,
			});
		}
		const rank = new Rank()
			.setUsername(usr.username)
			.setDiscriminator(usr.discriminator)
			.setLevel(this.levelHelper.getLvl(us))
			.setCurrentXP(this.levelHelper.getCurrentXp(us))
			.setRequiredXP(this.levelHelper.getRequiredXp(us))
			.setRank(await this.levelHelper.getRank(us))
			.setOverlay("#333640", 0.2, true)
			.setStatus("offline")
			.setBackground(
				"IMAGE",
				"https://img.freepik.com/vector-gratis/diseno-banner-fondo-profesional-negocios-abstracto-multiproposito_1340-16856.jpg",
			)
			.setAvatar(usr.avatarURL({ extension: "png" }));
		const attachment = new AttachmentBuilder(await rank.build(), {
			name: "rank-card.png",
		});
		interaction.reply({
			files: [attachment],
		});
	}
}

export default RankCommand;
