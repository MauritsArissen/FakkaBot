import { CommandInteraction, SlashCommandBuilder, AttachmentBuilder, PresenceManager } from "discord.js";
import { Rank } from "canvacord";
import LevelHelper from "../../util/LevelHelper";
import UserStats from "../../models/UserStats.model";

export default {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Show your ranking")
        .addUserOption((options) =>
            options
                .setName("user")
                .setNameLocalizations({
                    nl: "gebruiker"
                })
                .setDescription("the user you wanna see the stats of")
                .setDescriptionLocalizations({
                    nl: "de gebruiker waarvan je de statistieken wilt zien"
                })
        ),
    async execute(interaction: CommandInteraction) {
        
        const usr = interaction.options.getUser("user") || interaction.user;

        const us: [UserStats, boolean] = await UserStats.findOrCreate({
            where: { uid: usr.id },
            defaults: { xp: 0 }
        });

        const rank = new Rank()
            .setUsername(usr.username)
            .setDiscriminator(usr.discriminator)
            .setLevel(LevelHelper.getLvl(us[0]))
            .setCurrentXP(LevelHelper.getCurrentXp(us[0]))
            .setRequiredXP(LevelHelper.getRequiredXp(us[0]))
            .setRank(await LevelHelper.getRank(us[0]))
            .setOverlay("#333640", 0.2, true)
            .setStatus("offline")
            .setBackground("IMAGE", "https://img.freepik.com/vector-gratis/diseno-banner-fondo-profesional-negocios-abstracto-multiproposito_1340-16856.jpg")
            .setAvatar(usr.avatarURL({ extension: "png" }));

        let attachment = new AttachmentBuilder(await rank.build(), { name: "rank-card.png" });
        
        interaction.reply({
            files: [attachment]
        })
    }
}