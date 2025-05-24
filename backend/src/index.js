const express = require("express");
const cors = require("cors");
const { executeQuery } = require("./utils/executeQuery");
const { logAllRoutes } = require("./utils/routeLogger");
const { registerRoutes } = require("./utils/preserveRoutes");

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 4000;

// Function to check DB connection
async function getDbConnection() {
  try {
    const dbNameResult = await executeQuery(
      `SELECT DB_NAME() AS DatabaseName;`
    );
    console.log("✅ Connected To Database:", dbNameResult[0].DatabaseName);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

registerRoutes(app);

app.listen(PORT, async () => {
  await getDbConnection();
  console.log(`🚀 Server Is Running On Port: ${PORT}`);
  await logAllRoutes(app);
});
