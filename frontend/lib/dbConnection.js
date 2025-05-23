import sql from "mssql";

const config = {
  server: process.env.DB_SERVER || "",
  database: process.env.DB_NAME || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

console.log("MSSQL config:", config); // for debugging

let pool;

export async function getDbConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
