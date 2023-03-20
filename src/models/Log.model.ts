import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { ILog } from "../interfaces/ILog";

export interface LogModel extends Model<ILog>, ILog {}

@Table({ createdAt: "timestamp", updatedAt: false })
class Log extends Model<LogModel, ILog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  _id: number;

  @Column
  type: string;

  @Column(DataType.TEXT)
  message: string;

  @Column(DataType.TEXT)
  payload: string;
}

export default Log;
