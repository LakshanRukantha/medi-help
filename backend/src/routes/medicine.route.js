const express = require("express");
const { executeQuery } = require("../utils/executeQuery");
const router = express.Router();

router.get("/medicines", async (req, res) => {
  const medicines = await executeQuery("SELECT * FROM Medicine");
  res.json(medicines);
});

module.exports = router;
