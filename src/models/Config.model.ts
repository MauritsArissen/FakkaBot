import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IConfig } from "../interfaces/IConfig";

export interface ConfigModel extends Model<IConfig>, IConfig {}

@Table({ createdAt: false, updatedAt: false })
class Config extends Model<ConfigModel, IConfig> {
  @PrimaryKey
  @Column
  key: string;

  @Column
  value: string;
}

export default Config;
