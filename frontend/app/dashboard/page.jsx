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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { use, useEffect, useState } from "react";
import axios from "axios";

export const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [treatmentName, setTreatmentName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [medicineId, setMedicineId] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [treatmentDate, setTreatmentDate] = useState("");

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  const handleMedicineChange = (value) => {
    setMedicineName(value);
    const selectedMedicine = medicines.find(
      (med) => med.Medicine_Name === value
    );
    setMedicineId(selectedMedicine ? selectedMedicine.Medicine_ID : "");
  };

  

  useEffect(() => {
    axios
      .get("http://192.168.136.219:4000/api/v1/medicines")
      .then((res) => {
        setMedicines(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch medicines");
        setLoading(false);
      });
  }, []);
console.log("Medicines data:", medicines);

  const handleDelete = async () => {
  try {
    const response = await axios.delete(
      `http://192.168.136.219:4000/api/v1/delete-appointment/${selectedAppointmentId}`
    );
    axios
      .get("http://192.168.136.219:4000/api/v1/appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
  } catch (error) {
    console.error("Delete error:", error);
    setError("Failed to delete appointment.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    axios
      .get("http://192.168.136.219:4000/api/v1/appointments")
      .then((response) => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch appointments");
        setLoading(false);
      });
  }, []);



  const handleSubmit = async (e) => {
    const currentDate = new Date().toISOString().split("T")[0];
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.136.219:4000/api/v1/add-treatment",
        {
          appointmentId: selectedAppointmentId,
          doctorId: selectedDoctorId,
          medicineId,
          dosage,
          instructions,
          treatmentDate: currentDate,
          treatmentName,
        }
      );

      setTreatmentName("");
      setMedicineName("");
      setDosage("");
      setInstructions("");
      setTreatmentDate("");

      toast.success("Treatment added successfully!");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add treatment.");
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {console.log("Selected Appointment ID:", selectedAppointmentId , "Selected Doctor ID:", selectedDoctorId);
  },[selectedAppointmentId, selectedDoctorId]);

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
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
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
            <TableHead>Add Treatment</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.Appointment_ID}>
              <TableCell className="font-medium">
                {appointment.Appointment_ID}
              </TableCell>
              <TableCell>{appointment.Patient_Name}</TableCell>
              <TableCell>{formatDate(appointment.Appointment_Date)}</TableCell>
              <TableCell>{formatTime(appointment.Appointment_Time)}</TableCell>
              <TableCell>{appointment.Doctor_Name}</TableCell>
              <TableCell>
                {appointment.Treatment_Name
                  ? appointment.Treatment_Name
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Dialog
                  open={dialogOpen}
                  onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) {
                      setMedicineName("");
                      setMedicineId("");
                      setDosage("");
                      setInstructions("");
                      setTreatmentName("");
                      setSelectedAppointmentId(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="m-2"
                      onClick={() => {
                        setSelectedAppointmentId(appointment.Appointment_ID);
                        setSelectedDoctorId(appointment.Doctor_ID);
                        console.log(appointment.Doctor_ID);
                        
                        setDialogOpen(true);
                      }}
                    >
                      Add Treatment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Treatment Details</DialogTitle>
                      <DialogDescription>
                        Add medicine and dosage instructions for the treatment.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      className="flex flex-col gap-4"
                      onSubmit={handleSubmit}
                    >
                      <Label >Treatment Name</Label>
                      <Input
                        name="treatmentName"
                        type="text"
                        placeholder="Treatment Name"
                        value={treatmentName}
                        onChange={(e) => setTreatmentName(e.target.value)}
                      />

                      <Label htmlFor="medicineName">Medicine Name</Label>
                      <Select
                        value={medicineName}
                        onValueChange={(value) => handleMedicineChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Medicine name" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Medicine name</SelectLabel>
                            {medicines.map((medicine) => (
                              <SelectItem
                                key={medicine.Medicine_ID}
                                value={medicine.Medicine_Name}
                              >
                                {medicine.Medicine_Name} - {medicine.Price} LKR
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        name="dosage"
                        type="text"
                        placeholder="Dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                      />

                      <Label htmlFor="instructions">Instructions</Label>
                      <Input
                        name="instructions"
                        type="text"
                        placeholder="Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />


                      <Button type="submit" className="w-full">
                        Add
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => { setSelectedAppointmentId(appointment.Appointment_ID); }} variant="destructive">Cancle</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={function(){
                        handleDelete();
                      }} variant="destructive">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
