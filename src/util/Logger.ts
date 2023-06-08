import {
	bgBlackBright,
	bgBlue,
	bgBlueBright,
	bgCyanBright,
	bgGreen,
	bgMagenta,
	bgRed,
	bgWhite,
	bgYellow,
	bgYellowBright,
	black,
	bold,
} from "colorette";
import moment from "moment";

class Logger {
	public static log(message: string): void {
		console.log(`${this.formattedDate()} ${bgBlue(bold(" LOG "))} ${message}`);
	}

	public static info(message: string): void {
		console.info(
			`${this.formattedDate()} ${bgGreen(bold(" INFO "))} ${message}`,
		);
	}

	public static debug(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgMagenta(bold(" DEBUG "))} ${message}`,
		);
	}

	public static warn(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgYellow(bold(" WARN "))} ${message}`,
		);
	}

	public static error(message: string, err?: string): void {
		console.log(
			`${this.formattedDate()} ${bgRed(bold(" ERROR "))} ${message}\n${
				err != null ? err : "no error logged"
			}`,
		);
	}

	public static trace(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgBlackBright(bold(" TRACE "))} ${message}`,
		);
	}

	public static event(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgCyanBright(bold(" EVENT "))} ${message}`,
		);
	}

	public static command(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgYellowBright(bold(" COMMAND "))} ${message}`,
		);
	}

	public static button(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgMagenta(bold(" BUTTON "))} ${message}`,
		);
	}

	public static select(message: string): void {
		console.log(
			`${this.formattedDate()} ${bgBlueBright(bold(" COMMAND "))} ${message}`,
		);
	}

	private static formattedDate(): string {
		return bgWhite(black(bold(`[${moment().format("HH:mm:ss")}]`)));
	}
}

export default Logger;
