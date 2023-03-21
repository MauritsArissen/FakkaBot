import { PrismaClient, UserStats } from "@prisma/client";
import { autoInjectable, singleton } from "tsyringe";
import { Bot } from "../client";

@autoInjectable()
@singleton()
class LevelHelper {
  constructor(private prisma?: PrismaClient, private client?: Bot) {}

  private formula(lvl: number): number {
    return 5 * Math.pow(lvl, 2) + 50 * lvl + 100;
  }

  private getAllXp(lvl: number): number {
    let xp = 0;
    for (let i = 0; i <= lvl; i++) {
      xp += this.formula(i);
    }
    return xp;
  }

  public async getRank(us: UserStats): Promise<number> {
    const rows = await this.prisma.userStats.findMany({
      orderBy: [
        {
          xp: "desc",
        },
      ],
    });
    let i = 0;
    while (rows[i].uid != us.uid) {
      i++;
    }
    return i + 1;
  }

  public getLvl = (us: UserStats) => {
    let lvl = 0,
      xp = 0;
    while (xp < us.xp) {
      xp += this.formula(lvl);
      if (xp < us.xp) lvl++;
    }
    return lvl;
  };

  public getCurrentXp(us: UserStats): number {
    const lvl = this.getLvl(us) - 1;
    return us.xp - this.getAllXp(lvl);
  }

  public getRequiredXp(us: UserStats): number {
    const lvl = this.getLvl(us);
    return this.formula(lvl);
  }

  public async addXp(
    uid: string,
    _xp: number,
    cooldown: number
  ): Promise<boolean> {
    const us: UserStats = await this.prisma.userStats.upsert({
      where: { uid: uid },
      create: {
        uid: uid,
        xp: 0,
      },
      update: {},
    });

    if (
      !this.client.xpCooldown.has(us.uid) ||
      this.client.xpCooldown.get(us.uid) < Date.now()
    ) {
      const lvl = this.getLvl(us);
      await this.prisma.userStats.update({
        where: { uid: us.uid },
        data: { xp: us.xp + _xp },
      });
      await this.prisma.activity.create({
        data: {
          uid: us.uid,
          level: Math.round(cooldown / 60),
        },
      });
      this.client.xpCooldown.set(us.uid, Date.now() + cooldown * 1000);
      return lvl < this.getLvl(us);
    } else {
      return false;
    }
  }
}

export default LevelHelper;
