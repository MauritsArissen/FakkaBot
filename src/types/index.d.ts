import { Model } from "sequelize-typescript";
import { BuildOptions } from "sequelize/types";
import { UserStatsModel } from "../models/UserStats.model";

declare global {
  namespace Models {
    export type UserStats = typeof Model & {
      new (
        values?: Record<string, unknown>,
        options?: BuildOptions
      ): UserStatsModel;
    };
  }
}
