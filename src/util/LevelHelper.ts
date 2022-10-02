import Container from "typedi";
import { Bot } from "../client";
import UserStats from "../models/UserStats.model"

class LevelHelper {

    private static client: Bot = Container.get("client");

    private static formula = (lvl:number) => {
        return 5 * (Math.pow(lvl, 2)) + (50 * lvl) + 100
    }

    private static getAllXp(lvl:number) {
        let xp = 0;
        for (let i = 0; i <= lvl; i++) {
            xp += this.formula(i);
        }
        return xp;
    }

    static getRank = async (us:UserStats) => {
        let rows = await UserStats.findAll({
            order: [
                ["xp", "DESC"]
            ]
        });
        let i = 0;
        while (rows[i].uid != us.uid) {
            i++;
        }
        return i+1;
    }

    static getLvl = (us:UserStats) => {
        let lvl = 0,
            xp = 0;
        
        while (xp < us.xp) {
            xp += this.formula(lvl);
            if (xp < us.xp) lvl++;
        }

        return lvl;
    }

    static getCurrentXp = (us:UserStats) => {
        let lvl = this.getLvl(us) - 1;
        return us.xp - this.getAllXp(lvl);
    }

    static getRequiredXp = (us:UserStats) => {
        let lvl = this.getLvl(us);
        return this.formula(lvl);
    }

    static addXp = (us:UserStats, xp:number, cooldown:number): boolean => {
        if (!this.client.xpCooldown.has(us.uid) || this.client.xpCooldown.get(us.uid) > Date.now()) {
            let lvl = this.getLvl(us);
            us.xp += xp;
            us.save();
            this.client.xpCooldown.set(us.uid, Date.now() + (cooldown * 1000));
            return lvl < this.getLvl(us);
        } else {
            return false;
        }
    }

}

export default LevelHelper;