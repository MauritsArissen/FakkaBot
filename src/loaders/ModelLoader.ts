import { Model } from "sequelize-typescript";
import models from "../config/models";
import Logger from "../util/Logger";

class ModelLoader {
  public load(): { name: string; model: Model }[] {
    Logger.info("Loading models...");
    const modelsList: { name: string; model: Model }[] = Object.keys(
      models
    ).map((key) => {
      return {
        name: `${key}Model`,
        model: models[key],
      };
    });
    return modelsList;
  }
}

export default ModelLoader;
