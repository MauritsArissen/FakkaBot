import { PrismaClient } from "@prisma/client";
import {
  SlashCommandBuilder,
  CommandInteraction,
  SlashCommandSubcommandBuilder,
  SlashCommandRoleOption,
  SlashCommandIntegerOption,
  CommandInteractionOptionResolver,
} from "discord.js";
import { autoInjectable } from "tsyringe";
import ICommand from "../../interfaces/ICommand";

@autoInjectable()
class ActivityRoleCommand implements ICommand {
  constructor(private prisma?: PrismaClient) {}

  getName(): string {
    return "activityrole";
  }

  getSlashCommandBuilder(): SlashCommandBuilder {
    const slashCommand = new SlashCommandBuilder();
    const addSubcommand = new SlashCommandSubcommandBuilder();
    const removeSubcommand = new SlashCommandSubcommandBuilder();
    const roleSelectOption = new SlashCommandRoleOption();
    const activityIntegerOption = new SlashCommandIntegerOption();

    slashCommand.setName(this.getName());
    slashCommand.setDescription("Setup the activity roles");

    addSubcommand.setName("add");
    addSubcommand.setDescription("Add a new activity role");
    addSubcommand.addRoleOption(roleSelectOption);
    addSubcommand.addIntegerOption(activityIntegerOption);

    removeSubcommand.setName("remove");
    removeSubcommand.setDescription("Remove an activity role");
    removeSubcommand.addRoleOption(roleSelectOption);

    roleSelectOption.setName("role");
    roleSelectOption.setDescription("The role to add/remove");
    roleSelectOption.setRequired(true);

    activityIntegerOption.setName("activity");
    activityIntegerOption.setDescription("The activity in minutes");
    activityIntegerOption.setRequired(true);

    slashCommand.addSubcommand(addSubcommand);
    slashCommand.addSubcommand(removeSubcommand);

    return slashCommand;
  }

  async hasPermissions(interaction: CommandInteraction): Promise<boolean> {
    return interaction.memberPermissions.has("Administrator");
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    const options: CommandInteractionOptionResolver =
      interaction.options as CommandInteractionOptionResolver;

    if (options.getSubcommand() === "add") {
      const role = options.getRole("role");
      const activity = options.getInteger("activity");

      await this.prisma.activityRole.upsert({
        where: { rid: role.id },
        create: { rid: role.id, activityPoints: activity },
        update: { activityPoints: activity },
      });

      interaction.reply({
        content: `Added role ${role.name} with activity ${activity}`,
        ephemeral: true,
      });
    } else if (options.getSubcommand() === "remove") {
      const role = options.getRole("role");

      await this.prisma.activityRole.delete({ where: { rid: role.id } });

      interaction.reply({
        content: `Removed role ${role.name}`,
        ephemeral: true,
      });
    }
  }
}

export default ActivityRoleCommand;
