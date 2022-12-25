import { green, redBright } from "colorette";
import moment from "moment";
import Container from "typedi";

class Logger {
  private static _logModel: Models.Log;

  public static startSavingLogs() {
    this._logModel = Container.get("logModel");
  }

  public static log(message: string, type = "LOG", payload?: string) {
    const msg = this.date(type) + message;
    console.log(msg);
    if (this._logModel != null) {
      this._logModel.create({
        message: this.cleanParse(message),
        type: type,
        payload: payload,
      });
    }
  }

  public static info(message: string) {
    this.log(message, "INFO");
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

  private static cleanParse(message: string): string {
    let cleaning = false;
    return message
      .split("")
      .map((x) => {
        const result = x == "" || cleaning ? "" : x;
        if (x == "") cleaning = true;
        if (x == "m") cleaning = false;
        return result;
      })
      .join("");
  }
}

export default Logger;
