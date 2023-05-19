import { ModalSubmitInteraction } from "discord.js";
import IModal from "../../interfaces/IModal";

class SignupListModal implements IModal {
	getCustomId(): string {
		return "signupListModal";
	}

	execute(interaction: ModalSubmitInteraction): void {
		interaction.deferUpdate();
	}
}

export default SignupListModal;
