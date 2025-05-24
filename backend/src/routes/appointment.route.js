const express = require("express");
const { executeQuery } = require("../utils/executeQuery");
const router = express.Router();

// Get all appointments
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await executeQuery(`
      SELECT 
        a.Appointment_ID,
        a.Appointment_Date,
        a.Appointment_Time,

        pd.Person_name AS Doctor_Name,
        d.Doctor_ID,
        d.Specialization,

        pp.Person_name AS Patient_Name,
        pp.Gender,
        pp.Contact_No,
        pp.Email,

        (SELECT TOP 1 Treatment_Name FROM treatment t WHERE t.Appointment_ID = a.Appointment_ID) AS Treatment_Name,
        (SELECT TOP 1 Total_Amount FROM bill b WHERE b.Appointment_ID = a.Appointment_ID) AS Total_Amount,
        (SELECT TOP 1 Payment_Status FROM bill b WHERE b.Appointment_ID = a.Appointment_ID) AS Payment_Status

      FROM appointment a
      JOIN doctor d ON a.Doctor_ID = d.Doctor_ID
      JOIN person pd ON d.Person_ID = pd.Person_ID
      JOIN patient p ON a.Patient_ID = p.Patient_ID
      JOIN person pp ON p.Person_ID = pp.Person_ID
      ORDER BY a.Appointment_ID DESC;
    `);

    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get appointment by ID (assuming it uses a stored procedure)
router.get("/get-appointment/:id", async (req, res) => {
  const appointmentId = req.params.id;
  try {
    const appointment = await executeQuery(
      `EXEC GetAppointmentByPersonId @PersonID = ${appointmentId}`
    );

    if (appointment.length === 0) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json(appointment[0]);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new appointment
router.post("/create-appointment", async (req, res) => {
  const {
    doctorId,
    patientName,
    gender,
    contact,
    email,
    address,
    appointmentDate,
    appointmentTime,
  } = req.body;

  try {
    // 1. Insert into person
    const personIdResult = await executeQuery(
      `INSERT INTO person (Person_name, Gender, Contact_No, Email, Address)
       VALUES (@param0, @param1, @param2, @param3, @param4)
       SELECT SCOPE_IDENTITY() AS id`,
      [patientName, gender, contact, email, address]
    );

    // Get last inserted person ID
    const personId = personIdResult[0].id;

    // 2. Insert into patient
    const patientIdResult = await executeQuery(
      `
      INSERT INTO patient (Person_ID) VALUES (@param0)
      SELECT SCOPE_IDENTITY() AS id
      `,
      [personId]
    );

    const patientId = patientIdResult[0].id;

    // 3. Insert into appointment
    const appointmentIdResult = await executeQuery(
      `INSERT INTO appointment (Appointment_Date, Appointment_Time, Doctor_ID, Patient_ID)
       VALUES (@param0, @param1, @param2, @param3)
       SELECT SCOPE_IDENTITY() AS id
       `,
      [appointmentDate, appointmentTime, doctorId, patientId]
    );

    // Get last inserted appointment ID
    const appointmentId = appointmentIdResult[0].id;

    res.status(201).json({
      message: "Appointment created successfully",
      appointmentId,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete-appointment/:id", async (req, res) => {
  const appointmentId = req.params.id;

  console.log(appointmentId);

  try {
    const deleteAppointmentResult = await executeQuery(
      `DELETE FROM Appointment WHERE Appointment_ID = @param0`,
      [appointmentId]
    );

    res.status(200).json({
      message: "Appointment deleted successfully",
      result: deleteAppointmentResult,
    });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

module.exports = router;
