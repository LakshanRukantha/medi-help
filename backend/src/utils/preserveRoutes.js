const fs = require("fs");
const path = require("path");

async function registerRoutes(app) {
  const routerPath = path.join(__dirname, "../routes");

  if (fs.existsSync(routerPath)) {
    const routerFiles = fs
      .readdirSync(routerPath)
      .filter((file) => file.endsWith(".js"));

    console.log("\n✨ Initializing API Route Files...\n");

    routerFiles.forEach((file, i) => {
      const route = require(path.join(routerPath, file));
      console.log(`📄 ${i + 1} ${file}`);
      app.use("/api/v1", route);
    });

    console.log(
      `\n✅ All ${routerFiles.length} Route File(s) Initialized Successfully from ${routerPath}`
    );
  } else {
    console.warn(`⚠️ Routes folder not found at: ${routerPath}`);
  }
}

module.exports = { registerRoutes };
