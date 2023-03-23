import BotPresenceEvent from "../events/BotPresenceEvent";
import DeployCommandsEvent from "../events/DeployCommandsEvent";
import MessageInteractionCreateEvent from "../events/MessageInteractionCreateEvent";
import VoiceActivityEvent from "../events/VoiceActivityEvent";
import RefreshTopBtn from "../interactors/buttons/RefreshTopBtn";
import ActivityCommand from "../interactors/commands/ActivityCommand";
import ActivityRoleCommand from "../interactors/commands/ActivityRoleCommand";
import InfoCommand from "../interactors/commands/InfoCommand";
import RankCommand from "../interactors/commands/RankCommand";
import TopCommand from "../interactors/commands/TopCommand";

export default {
  events: [
    VoiceActivityEvent,
    MessageInteractionCreateEvent,
    BotPresenceEvent,
    DeployCommandsEvent,
  ],
  commands: [
    RankCommand,
    TopCommand,
    InfoCommand,
    ActivityCommand,
    ActivityRoleCommand,
  ],
  buttons: [RefreshTopBtn],
  selectMenus: [],
};
