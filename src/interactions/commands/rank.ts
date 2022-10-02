import { CommandInteraction, SlashCommandBuilder, AttachmentBuilder } from "discord.js";
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

        const us: UserStats = await UserStats.findOne({ where: { uid: usr.id }});
        if (!us) return interaction.reply({
            content: "This user does not have a profile",
            ephemeral: true
        })

        const rank = new Rank()
            .setUsername(usr.username)
            .setDiscriminator(usr.discriminator)
            .setLevel(LevelHelper.getLvl(us))
            .setCurrentXP(LevelHelper.getCurrentXp(us))
            .setRequiredXP(LevelHelper.getRequiredXp(us))
            .setRank(await LevelHelper.getRank(us))
            .setOverlay("#333640", 0.2, true)
            .setStatus("offline")
            .setBackground("IMAGE", "https://img.freepik.com/vector-gratis/diseno-banner-fondo-profesional-negocios-abstracto-multiproposito_1340-16856.jpg")
            .setAvatar(usr.avatarURL({ extension: "png" }));

        const attachment = new AttachmentBuilder(await rank.build(), { name: "rank-card.png" });
        
        interaction.reply({
            files: [attachment]
        })
    }
}