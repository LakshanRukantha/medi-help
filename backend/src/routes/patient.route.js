const express = require("express");
const { executeQuery } = require("../utils/executeQuery");
const router = express.Router();

router.get("/patients", async (req, res) => {
  const patients = await executeQuery("SELECT * FROM Patient");
  res.json(patients);
});

module.exports = router;
