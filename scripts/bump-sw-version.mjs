import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const swPath = join(__dirname, "..", "dist", "sw.js");

const buildId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

const content = readFileSync(swPath, "utf-8");
const updated = content.replace(/__CACHE_VERSION__/g, buildId);

writeFileSync(swPath, updated, "utf-8");

console.log(`[bump-sw-version] sw.js cache name stamped with build id: ${buildId}`);
