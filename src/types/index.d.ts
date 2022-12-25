import { Model } from "sequelize-typescript";
import { BuildOptions } from "sequelize/types";
import { LogModel } from "../models/Log.model";
import { UserStatsModel } from "../models/UserStats.model";

declare global {
  namespace Models {
    export type UserStats = typeof Model & {
      new (
        values?: Record<string, unknown>,
        options?: BuildOptions
      ): UserStatsModel;
    };
    export type Log = typeof Model & {
      new (values?: Record<string, unknown>, options?: BuildOptions): LogModel;
    };
  }
}
