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
      serverSelectionTimeoutMS: isTest ? 1000 : 5000,
    });
    console.log(
      `[Database] Connected to MongoDB at ${uri.replace(/\/\/.*@/, "//***@")}`,
    );
  } catch (err: any) {
    if (isTest) {
      // Tests are allowed to use in-memory fallback
      console.warn(
        `[Database] Test mode: starting embedded MongoMemoryServer (${err.message})`,
      );
      try {
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: "mplad_insight_test" },
        });
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(
          `[Database] Test: connected to MongoMemoryServer at ${memoryUri}`,
        );
      } catch (memErr: any) {
        console.error(
          "[Database] Fatal: Failed to initialize MongoMemoryServer for tests",
          memErr,
        );
        throw memErr;
      }
    } else {
      // C7 FIX: Production/dev must NEVER silently fall back to in-memory DB.
      // An in-memory DB loses all data on restart and cannot be trusted for governance data.
      console.error(
        `[Database] FATAL: Cannot connect to MongoDB at ${uri.replace(/\/\/.*@/, "//***@")}`,
      );
      console.error(`[Database] Error: ${err.message}`);
      console.error(
        "[Database] Refusing to start with in-memory fallback in production/dev mode.",
      );
      console.error(
        "[Database] Set MONGODB_URI to a valid MongoDB connection string and retry.",
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
