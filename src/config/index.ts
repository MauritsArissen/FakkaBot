import dotenv from "dotenv";
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export default {
  token: process.env.TOKEN,
  logs: {
    level: process.env.LOGLEVEL || "silly",
  },
  databaseUrl: process.env.DB_URL,
};
