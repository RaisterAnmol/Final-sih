import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<void> {
  const uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mplad_insight";
  const isTest = process.env.NODE_ENV === "test";

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: isTest ? 1000 : 4000,
    });
    console.log(
      `[Database] Connected to MongoDB at ${uri.replace(/\/\/.*@/, "//***@")}`,
    );
  } catch (err: any) {
    if (isTest || process.env.STRICT_MONGODB !== "true") {
      console.warn(
        `[Database] Local MongoDB not detected at ${uri} (${err.message}).`,
      );
      console.log(
        "[Database] Starting embedded MongoMemoryServer engine (as documented in RUNBOOK)...",
      );
      try {
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: isTest ? "mplad_insight_test" : "mplad_insight" },
        });
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(
          `[Database] ✓ Connected to embedded MongoMemoryServer at ${memoryUri}`,
        );
      } catch (memErr: any) {
        console.error(
          "[Database] Fatal: Failed to initialize MongoMemoryServer",
          memErr,
        );
        throw memErr;
      }
    } else {
      console.error(
        `[Database] FATAL: Cannot connect to MongoDB at ${uri.replace(/\/\/.*@/, "//***@")}`,
      );
      console.error(`[Database] Error: ${err.message}`);
      console.error(
        "[Database] STRICT_MONGODB=true is active. Set MONGODB_URI to a valid connection string.",
      );
      process.exit(1);
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
