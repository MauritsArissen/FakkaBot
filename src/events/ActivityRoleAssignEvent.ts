import { PrismaClient } from "@prisma/client";
import { autoInjectable } from "tsyringe";
import IEvent from "../interfaces/IEvent";
import { Bot } from "../client";

@autoInjectable()
class ActivityRoleAssignEvent implements IEvent {
  constructor(private prisma?: PrismaClient) {}

  getEventType(): string {
    return "ready";
  }

  getEventOccurance(): boolean {
    return true;
  }

  async execute(client: Bot): Promise<void> {
    this.loop(client);
  }

  async loop(client: Bot) {
    const guilds = await client.guilds.cache;
    guilds.forEach(async (guild) => {
      const activityRoles = await this.prisma.activityRole.findMany();
      const roles = await activityRoles.map(async (activityRole) => {
        return {
          required: activityRole.activityPoints,
          role: await guild.roles.fetch(activityRole.rid),
        };
      });

      const members = await guild.members.fetch();
      members.forEach(async (member) => {
        const userActivity = await this.prisma.activity.aggregate({
          where: {
            uid: member.id,
            timestamp: { gte: new Date(Date.now() - 12096e5) },
          },
          _sum: { level: true },
        });

        const time = userActivity._sum.level || 0;

        if (time != null) {
          roles.forEach(async (role) => {
            const riq = await role;
            if (riq.role != null) {
              if (time >= riq.required) {
                if (!member.roles.cache.has(riq.role.id))
                  member.roles.add(riq.role);
              } else {
                if (member.roles.cache.has(riq.role.id))
                  member.roles.remove(riq.role);
              }
            }
          });
        }
      });
    });
    setTimeout(() => this.loop(client), 60 * 60 * 1000);
  }
}

export default ActivityRoleAssignEvent;
