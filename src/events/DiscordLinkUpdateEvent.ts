import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { schedule } from "node-cron";
import { PrismaClient } from "@prisma/client";
import { Bot } from "../client";

@autoInjectable()
class DiscordLinkUpdateEvent implements IEvent {
	constructor(private prisma?: PrismaClient) {}

	getEventType(): string {
		return "ready";
	}

	getEventOccurance(): boolean {
		return true;
	}

	execute(client: Bot): void {
		schedule("0 * * * *", async () => {
			const links = await this.prisma.discordLink.findMany();
			links.forEach(async (link) => {
				const guild = await client.guilds.fetch(link.gid);
				const member = await guild.members.fetch(link.uid);

				this.prisma.discordLink.update({
					where: { uid: link.uid },
					data: {
						displayName: member.displayName,
						hexcolor: member.displayHexColor,
					},
				});
			});
		});
	}
}

export default DiscordLinkUpdateEvent;
