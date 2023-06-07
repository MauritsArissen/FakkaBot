import { PrismaClient } from "@prisma/client";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	CommandInteractionOptionResolver,
	Role,
	SlashCommandBuilder,
	TextChannel,
} from "discord.js";

@autoInjectable()
class PingRoleCommands implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "pingrole";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Manage ping roles")
			.addSubcommand((subcommand) =>
				subcommand
					.setName("create")
					.setDescription("Create a ping role")
					.addStringOption((name) =>
						name
							.setName("name")
							.setDescription("The name of the ping role")
							.setRequired(true),
					)
					.addStringOption((emoji) =>
						emoji
							.setName("emoji")
							.setDescription("The emoji of the ping role")
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("delete")
					.setDescription("Delete a ping role")
					.addRoleOption((role) =>
						role
							.setName("role")
							.setDescription("The role to delete")
							.setRequired(true),
					),
			)
			.addSubcommand((subcommand) =>
				subcommand
					.setName("setchannel")
					.setDescription("Set the channel to send ping role buttons in")
					.addChannelOption((channel) =>
						channel
							.setName("channel")
							.setDescription("The channel to send ping role buttons in")
							.setRequired(true),
					),
			) as SlashCommandBuilder;
	}

	async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
		return interaction.memberPermissions.has("Administrator");
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		const options: CommandInteractionOptionResolver =
			interaction.options as CommandInteractionOptionResolver;

		switch (options.getSubcommand()) {
			case "create": {
				const setting = await this.prisma.settings.findFirst({
					where: {
						key: "pingRoleChannel",
					},
				});

				if (!setting) {
					await interaction.reply({
						content: "No ping role channel set",
						ephemeral: true,
					});
					break;
				}

				const name = options.getString("name");
				const emoji = options.getString("emoji");

				const role = await interaction.guild.roles.create({
					name: name,
					mentionable: true,
					color: "#6042f5",
				});

				const button = new ButtonBuilder()
					.setCustomId("pingRoleAssign")
					.setLabel(name)
					.setEmoji(emoji)
					.setStyle(ButtonStyle.Secondary);

				const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
					button,
				);

				const channel = (await interaction.guild.channels.fetch(
					setting.value,
				)) as TextChannel;
				const msg = await channel.send({
					components: [actionRow],
				});

				await this.prisma.pingRole.create({
					data: {
						rid: role.id,
						name: name,
						emoji: emoji,
						mid: msg.id,
					},
				});

				await interaction.reply({
					content: `Created ping role <@&${role.id}>`,
					ephemeral: true,
				});
				break;
			}
			case "delete": {
				const role = options.getRole("role");

				const pingRole = await this.prisma.pingRole.findFirst({
					where: {
						rid: role.id,
					},
				});

				if (!pingRole) {
					await interaction.reply({
						content: `Role <@&${role.id}> is not a ping role`,
						ephemeral: true,
					});
					break;
				}

				await this.prisma.pingRole.delete({
					where: {
						rid: role.id,
					},
				});

				const setting = await this.prisma.settings.findFirst({
					where: {
						key: "pingRoleChannel",
					},
				});

				if (setting) {
					const channel = (await interaction.guild.channels.fetch(
						setting.value,
					)) as TextChannel;
					const msg = await channel.messages.fetch(pingRole.mid);
					if (msg.deletable) await msg.delete();
				}

				await (role as Role).delete("Ping role deleted");

				await interaction.reply({
					content: `Deleted ping role <@&${role.id}>, name was ${role.name}`,
					ephemeral: true,
				});
				break;
			}
			case "setchannel": {
				const channel = options.getChannel("channel");

				await this.prisma.settings.upsert({
					where: {
						key: "pingRoleChannel",
					},
					update: {
						value: channel.id,
					},
					create: {
						key: "pingRoleChannel",
						value: channel.id,
					},
				});

				await interaction.reply({
					content: `Set ping role channel to <#${channel.id}>`,
					ephemeral: true,
				});
				break;
			}
		}
	}
}

export default PingRoleCommands;
