const express = require("express");
const { executeQuery } = require("../utils/executeQuery");
const router = express.Router();

router.get("/treatment/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Fetching treatment with ID: ${id}`);
    const treatment = await executeQuery(`
      SELECT * FROM Treatment
    `);

    res.json(treatment);
  } catch (error) {
    console.error("Error fetching treatment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/add-treatment", async (req, res) => {
  try {
    const {
      treatmentDate,
      treatmentName,
      doctorId,
      appointmentId,
      medicineId,
      dosage,
      instructions,
    } = req.body;

    // Optional: Basic validation for treatment details
    if (!treatmentDate || !treatmentName || !doctorId || !appointmentId) {
      return res
        .status(400)
        .json({ error: "Missing required treatment details." });
    }

    // Optional: Basic validation for prescription details
    if (!medicineId || !dosage || !instructions) {
      return res
        .status(400)
        .json({ error: "Missing required prescription details." });
    }

    // 1. Insert into treatment table
    const treatmentResult = await executeQuery(
      `
      INSERT INTO treatment (Treatment_Date, Treatment_Name, Doctor_ID, Appointment_ID)
      VALUES (@param0, @param1, @param2, @param3);
      SELECT SCOPE_IDENTITY() AS id;
      `,
      [treatmentDate, treatmentName, doctorId, appointmentId]
    );

    const treatmentId = treatmentResult[0].id;

    // 2. Insert into prescription table (using the treatmentId obtained above)
    const prescriptionResult = await executeQuery(
      `
      INSERT INTO prescription (Medicine_ID, Dosage, Instruction, Treatment_ID)
      VALUES (@param0, @param1, @param2, @param3);
      SELECT SCOPE_IDENTITY() AS id;
      `,
      [medicineId, dosage, instructions, treatmentId] // Pass treatmentId here
    );

    const prescriptionId = prescriptionResult[0].id;

    res.status(201).json({
      message: "Treatment and prescription added successfully",
      treatmentId,
      prescriptionId,
    });
  } catch (error) {
    console.error("Error adding treatment and prescription:", error); // Update log message
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
