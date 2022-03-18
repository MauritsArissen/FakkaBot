import { Model } from "sequelize-typescript";
import { BuildOptions } from "sequelize/types";
import { ConfigModel } from "../models/Config.model";
import { PingRoleModel } from "../models/PingRole.model";

declare global {
  namespace Models {
    export type PingRole = typeof Model & {
      new (
        values?: Record<string, unknown>,
        options?: BuildOptions
      ): PingRoleModel;
    };
    export type Config = typeof Model & {
      new (
        values?: Record<string, unknown>,
        options?: BuildOptions
      ): ConfigModel;
    };
  }
}
