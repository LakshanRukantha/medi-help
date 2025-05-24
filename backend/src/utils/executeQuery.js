const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const DATABASE_URI = process.env.DATABASE_URI;

const config = {
  connectionString: DATABASE_URI,
};

async function executeQuery(query, params = []) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();

    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
}

module.exports = { executeQuery };
