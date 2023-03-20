import { PrismaClient } from "@prisma/client";
import { container } from "tsyringe";
import Logger from "../util/Logger";

class DatabaseLoader {
  constructor() {}

  public async load(): Promise<void> {
    Logger.info("Loading database...");
    const prisma: PrismaClient = new PrismaClient();
    container.register<PrismaClient>(PrismaClient, { useValue: prisma });
  }
}

export default DatabaseLoader;
