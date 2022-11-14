import { SlashCommandBuilder } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("roll")
		.setDescription("Rolls between two numbers")
		.addIntegerOption((option) =>
			option
				.setName("lowbound")
				.setDescription("The minimum number that can be rolled")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("highbound")
				.setDescription("The maximum number that can be rolled")
				.setRequired(true)
		),

	async execute(interaction) {
		const lowbound = interaction.options.get("lowbound").value;
		const highbound = interaction.options.get("highbound").value;

		if (lowbound > highbound) {
			return await interaction.reply({
				content: "Lowerbound cannot be higher than Higherbound!",
				ephemeral: true,
			});
		}

		const roll = Math.floor(
			Math.random() * (highbound - lowbound) + lowbound
		);

		await interaction.reply({
			content: `You rolled **${roll}**!`,
		});
	},
};
