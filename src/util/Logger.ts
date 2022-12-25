import { green, redBright } from "colorette";
import moment from "moment";

class Logger {
  public static log(message: string, type = "LOG") {
    console.log(this.date(type) + message);
  }

  public static info(message: string) {
    console.log(this.date("INFO") + message);
  }

  public static error(message: string, err?: string) {
    console.log(this.date("ERROR") + message + err != null ? `\n${err}` : "");
  }

  private static date(type: string): string {
    const previewType = green(`"${type}"`);
    const now = moment();
    const hh = redBright(now.format("HH"));
    const mm = redBright(now.format("mm"));
    const ss = redBright(now.format("ss"));
    return `[${previewType} - ${hh}:${mm}:${ss}] `;
  }
}

export default Logger;
