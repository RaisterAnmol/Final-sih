import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { seedOfficialMplads } from "./seedOfficialMplads.js";
import { seedDemoAccounts } from "./seedData.js";

async function run() {
  console.log("[SeedRunner] Starting public-source MPLADS snapshot seed (60,359 records)...");
  await connectDatabase();
  await seedDemoAccounts();
  const stats = await seedOfficialMplads(65000);
  console.log(`[SeedRunner] Completed authoritative import: ${stats.rowsImported} works persisted.`);
  await disconnectDatabase();
  process.exit(0);
}

run().catch((err) => {
  console.error("[SeedRunner] Failed:", err);
  process.exit(1);
});
