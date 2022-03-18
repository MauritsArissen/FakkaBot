import {
  Guild,
  MessageActionRow,
  MessageSelectMenu,
  TextChannel,
} from "discord.js";
import Container from "typedi";

class PingsUtil {
  constructor() {}

  static updateMessage = async (guild: Guild) => {
    const configModel: Models.Config = Container.get("configModel");
    const channelIdRecord = await configModel.findOne({
      where: { key: "rolePingsChannelId" },
    });
    const messageIdRecord = await configModel.findOne({
      where: { key: "rolePingsMessageId" },
    });

    if (!channelIdRecord.value || !messageIdRecord) return;

    const channel = (await guild.channels.fetch(
      channelIdRecord.value
    )) as TextChannel;
    const message = await channel.messages.fetch(messageIdRecord.value);

    message.edit({ components: [await PingsUtil.pingSelectMenuRow()] });
  };

  static pingSelectMenuRow = async () => {
    const pingRoleModel: Models.PingRole = Container.get("pingRoleModel");
    const list = await pingRoleModel.findAll();

    const optionList = list.map((x) => {
      return {
        label: x.label,
        description: x.description,
        value: x.value,
        emoji: x.emoji,
      };
    });

    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("pingsSelect")
        .setPlaceholder("Nothing selected")
        .setMinValues(0)
        .setMaxValues(optionList.length)
        .addOptions(optionList)
    );

    return row;
  };
}

export default PingsUtil;
