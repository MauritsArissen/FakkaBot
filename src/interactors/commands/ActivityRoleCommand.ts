import { PrismaClient } from "@prisma/client";
import {
	SlashCommandBuilder,
	CommandInteraction,
	CommandInteractionOptionResolver,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import TimeHelper from "../../util/TimeHelper";

@autoInjectable()
class ActivityRoleCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "activityrole";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Setup the activity roles")
			.addSubcommand((command) =>
				command
					.setName("add")
					.setDescription("Add a new activity role")
					.addRoleOption((role) =>
						role
							.setName("role")
							.setDescription("The role to add")
							.setRequired(true)
					)
					.addIntegerOption((activity) =>
						activity
							.setName("activitypoints")
							.setDescription("The activitypoints required in minutes")
							.setRequired(true)
					)
			)
			.addSubcommand((command) =>
				command
					.setName("remove")
					.setDescription("Remove an existing activity role")
					.addRoleOption((role) =>
						role
							.setName("role")
							.setDescription("The role to add")
							.setRequired(true)
					)
			)
			.addSubcommand((command) =>
				command.setName("list").setDescription("List all activity roles")
			) as SlashCommandBuilder;
	}

	async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
		return interaction.memberPermissions.has("Administrator");
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const options: CommandInteractionOptionResolver =
			interaction.options as CommandInteractionOptionResolver;

		switch (options.getSubcommand()) {
			case "add": {
				const role = options.getRole("role");
				const activityPoints = options.getInteger("activitypoints");

				await this.prisma.activityRole.upsert({
					where: { rid: role.id },
					create: { rid: role.id, activityPoints: activityPoints },
					update: { activityPoints: activityPoints },
				});

				interaction.reply({
					content: `Added role ${role.name} with activity ${activityPoints}`,
					ephemeral: true,
				});
				break;
			}

			case "remove": {
				const role = options.getRole("role");

				await this.prisma.activityRole.delete({ where: { rid: role.id } });

				interaction.reply({
					content: `Removed role ${role.name}`,
					ephemeral: true,
				});
				break;
			}

			case "list": {
				const activityRoles = await this.prisma.activityRole.findMany({
					orderBy: { activityPoints: "desc" },
				});

				const activityRoleList = activityRoles
					.map((activityRole) => {
						return `<@&${activityRole.rid}>: ${TimeHelper.minuteToTimeFormat(
							activityRole.activityPoints
						)}`;
					})
					.join("\n");

				interaction.reply({
					content: `**Activity Roles**\n${activityRoleList}`,
					ephemeral: true,
				});
				break;
			}
		}
	}
}

export default ActivityRoleCommand;
