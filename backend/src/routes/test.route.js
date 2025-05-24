const express = require("express");
const sql = require("mssql/msnodesqlv8");
const { executeQuery } = require("../utils/executeQuery");

const router = express.Router();

router.get("/test", async (req, res) => {
  //   const { patientName, gender, contact, email, address } = req.body;
  // hardcode above values

  try {
    const query = `
        SELECT * FROM Person;
    `;

    const result = await executeQuery(query);
    console.log(result);
    res.send({ result, status: 200 });
  } catch (error) {
    console.error("Insert failed:", error);
    res.status(500).json({ error: "Insert failed", details: error.message });
  }
});

module.exports = router;
