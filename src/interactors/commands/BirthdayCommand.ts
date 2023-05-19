import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";
import { PrismaClient } from "@prisma/client";
import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	SlashCommandBuilder,
} from "discord.js";

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

@autoInjectable()
class BirthdayCommand implements ICommand {
	constructor(private prisma?: PrismaClient) {}

	getName(): string {
		return "birthday";
	}

	getSlashCommandBuilder(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName(this.getName())
			.setDescription("Fakka's birthday manager")
			.addSubcommand((command) =>
				command
					.setName("set")
					.setDescription("Set your birthday")
					.addIntegerOption((month) =>
						month
							.setName("month")
							.setDescription("Your birth month")
							.setChoices(
								...months.map((month, index) => ({
									name: month,
									value: index,
								}))
							)
							.setRequired(true)
					)
					.addIntegerOption((day) =>
						day
							.setName("day")
							.setDescription("Your birth date")
							.setMinValue(1)
							.setMaxValue(31)
							.setRequired(true)
					)
			)
			.addSubcommand((command) =>
				command.setName("remove").setDescription("Remove your birthday")
			)
			.addSubcommand((command) =>
				command.setName("list").setDescription("List all birthdays")
			)
			.addSubcommand((command) =>
				command
					.setName("setchannel")
					.setDescription("Set the birthday channel")
					.addChannelOption((channel) =>
						channel
							.setName("channel")
							.setDescription("The channel to announce birthdays in")
							.setRequired(true)
					)
			) as SlashCommandBuilder;
	}

	async hasPermissions(): Promise<boolean> {
		return true;
	}

	async execute(interaction: CommandInteraction): Promise<any> {
		const options: CommandInteractionOptionResolver =
			interaction.options as CommandInteractionOptionResolver;

		switch (options.getSubcommand()) {
			case "set": {
				const month = options.getInteger("month");
				const day = options.getInteger("day");

				await this.prisma.birthday.upsert({
					where: { uid: interaction.user.id },
					create: { uid: interaction.user.id, month: month, day: day },
					update: { month: month, day: day },
				});

				interaction.reply({
					content: `Your birthday has been set to \`${months[month]} ${day}\``,
					ephemeral: true,
				});
				break;
			}

			case "remove": {
				await this.prisma.birthday.delete({
					where: { uid: interaction.user.id },
				});

				interaction.reply({
					content: `Your birthday has been removed and wont be announced anymore`,
					ephemeral: true,
				});
				break;
			}

			case "list": {
				const birthdays = await this.prisma.birthday.findMany({
					orderBy: [{ month: "asc" }, { day: "asc" }],
				});

				const birthdayList = birthdays.map(
					(birthday) =>
						`<@${birthday.uid}>: \`${months[birthday.month]} ${birthday.day}\``
				);

				interaction.reply({
					content: `The birthdays registered in Fakka:\n\n${birthdayList.join(
						"\n"
					)}`,
					ephemeral: true,
				});
				break;
			}

			case "setchannel": {
				const channel = options.getChannel("channel");

				await this.prisma.settings.upsert({
					where: { key: "birthdayChannel" },
					create: { key: "birthdayChannel", value: channel.id },
					update: { value: channel.id },
				});

				interaction.reply({
					content: `The birthday channel has been set to <#${channel.id}>`,
					ephemeral: true,
				});
				break;
			}
		}
	}
}

export default BirthdayCommand;
