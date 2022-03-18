import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
  token: process.env.TOKEN,
  logs: {
    level: process.env.LOGLEVEL || "silly",
  },
  clientId: process.env.CLIENTID,
  guildId: process.env.GUILDID,
  databaseUrl: process.env.DB_URL,
  botModRoleId: "924330150441672714",
};
