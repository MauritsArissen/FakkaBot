import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { IUserStats } from "../interfaces/IUserStats";

export interface UserStatsModel extends Model<IUserStats>, IUserStats {}

@Table({ createdAt: false, updatedAt: false })
class UserStats extends Model<UserStatsModel, IUserStats> {
    @PrimaryKey
    @Column
    uid: string;

    @Column
    xp: number;
}

export default UserStats;