import { autoInjectable } from "tsyringe";
import { Bot } from "../client";
import IEvent from "../interfaces/IEvent";
import { schedule } from "node-cron";
import { PrismaClient } from "@prisma/client";
import { TextChannel } from "discord.js";

@autoInjectable()
class BirthdayCronJobEvent implements IEvent {
	constructor(private prisma?: PrismaClient) {}

	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	execute(client: Bot): void {
		schedule("0 9 * * *", async () => {
			const date = new Date();
			const birthdayChannel = await this.prisma.settings.findFirst({
				where: { key: "birthdayChannel" },
			});
			const birthdays = await this.prisma.birthday.findMany({
				where: { month: date.getMonth(), day: date.getDate() },
			});

			birthdays.forEach(async (birthday) => {
				if (birthdayChannel) {
					const channel = client.channels.cache.get(
						birthdayChannel.value
					) as TextChannel;
					const guild = channel.guild;
					const member = guild.members.cache.get(birthday.uid);

					if (!member) return;
					if (channel.isTextBased) {
						await channel.send({
							content: `🎉 **Happy birthday <@${birthday.uid}>!** 🎉`,
							files: [
								{
									attachment:
										"https://i.giphy.com/media/6eGrt3Y9j0LnBrLPVd/giphy.gif",
									name: "birthday.gif",
								},
							],
						});
					}
				}
			});
		});
	}
}

export default BirthdayCronJobEvent;
