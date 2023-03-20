import BotPresenceEvent from "../events/BotPresenceEvent";
import DeployCommandsEvent from "../events/DeployCommandsEvent";
import MessageInteractionCreateEvent from "../events/MessageInteractionCreateEvent";
import VoiceActivityEvent from "../events/VoiceActivityEvent";
import RefreshTopBtn from "../interactors/buttons/RefreshTopBtn";
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
  commands: [RankCommand, TopCommand, InfoCommand],
  buttons: [RefreshTopBtn],
  selectMenus: [],
};
