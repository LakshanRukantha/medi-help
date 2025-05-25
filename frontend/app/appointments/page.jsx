"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import axios from "axios";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);     

  useEffect(() => {
    axios.get("http://192.168.136.219:4000/api/v1/appointments") 
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch appointments");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

function formatTime(isoTimeString) {
  const date = new Date(isoTimeString);
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  minutes = minutes.toString().padStart(2, "0");

  return `${hours}:${minutes} ${ampm}`;
}
  console.log("Appointments data:", appointments);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-5">{error}</div>;

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="text-3xl font-bold">Appointments</h1>
      <Table className="border-2">
        <TableCaption>A list of Appointments</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Appointment ID</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Appointment Date</TableHead>
            <TableHead>Appointment Time</TableHead>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Treatment Name</TableHead>
            <TableHead>Total Amount(LKR)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.Appointment_ID}>
              <TableCell className="font-medium">{appointment.Appointment_ID}</TableCell>
              <TableCell>{appointment.Patient_Name}</TableCell>
              <TableCell>{formatDate(appointment.Appointment_Date)}</TableCell>
              <TableCell>{formatTime(appointment.Appointment_Time)}</TableCell>
              <TableCell>{appointment.Doctor_Name}</TableCell>
              <TableCell>{appointment.Treatment_Name ? appointment.Treatment_Name : "N/A"}</TableCell>

              <TableCell>{appointment.Total_Amount ? appointment.Total_Amount : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Appointments;