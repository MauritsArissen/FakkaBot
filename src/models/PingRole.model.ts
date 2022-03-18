import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IPingRole } from "../interfaces/IPingRole";

export interface PingRoleModel extends Model<IPingRole>, IPingRole {}

@Table({ createdAt: false, updatedAt: false })
class PingRole extends Model<PingRoleModel, IPingRole> {
  @PrimaryKey
  @Column
  label: string;

  @Column
  value: string;

  @Column
  description: string;

  @Column
  emoji: string;

  @Column
  roleId: string;
}

export default PingRole;
