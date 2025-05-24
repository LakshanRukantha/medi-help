const express = require("express");
const { executeQuery } = require("../utils/executeQuery");
const router = express.Router();

// Get all doctors
router.get("/doctors", async (req, res) => {
  const doctors = await executeQuery(`
    SELECT 
        d.Doctor_ID,
        p.Person_name AS Doctor_Name,
        d.Consultation_Fee,
        d.Specialization
    FROM 
        doctor d
    JOIN 
        person p ON d.Person_ID = p.Person_ID;
    `);
  res.json(doctors, { status: 200 });
});

module.exports = router;
