import { Model } from "sequelize-typescript";
import models from "../config/models";

export default (): { name: string; model: Model }[] => {
  const modelsList: { name: string; model: Model }[] = Object.keys(models).map(
    (key) => {
      return {
        name: `${key}Model`,
        model: models[key],
      };
    }
  );
  return modelsList;
};
