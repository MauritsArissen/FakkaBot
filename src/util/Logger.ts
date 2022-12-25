import { green, redBright } from "colorette";
import moment from "moment";

class Logger {
  public static log(message: string, type: string = "LOG") {
    console.log(this.date(type) + message);
  }

  public static info(message: string) {
    console.log(this.date("INFO") + message);
  }

  public static error(message: string, err?: string) {
    console.log(this.date("ERROR") + message + err != null ? `\n${err}` : "");
  }

  private static date(type: string): string {
    let previewType = green(`"${type}"`);
    let now = moment();
    let hh = redBright(now.format("HH"));
    let mm = redBright(now.format("mm"));
    let ss = redBright(now.format("ss"));
    return `[${previewType} - ${hh}:${mm}:${ss}] `;
  }
}

export default Logger;
