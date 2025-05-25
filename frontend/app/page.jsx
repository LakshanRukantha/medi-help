"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Make sure you have installed it

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Initial form state
const initialFormData = {
  patientName: "",
  doctorName: "",
  doctorId: "",
  gender: "",
  appointmentDate: "",
  appointmentTime: "",
  contact: "",
  address: "",
  email: "",
};

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  // Fetch doctor list
  useEffect(() => {
    axios
      .get("http://192.168.136.219:4000/api/v1/doctors")
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching doctor data:", err);
        toast.error("Failed to load doctors");
      });
  }, []);

  // Handle doctor selection
  const handleDoctor = (value) => {
    const selectedDoctor = doctors.find((doc) => doc.Doctor_Name === value);
    if (selectedDoctor) {
      setFormData((prev) => ({
        ...prev,
        doctorName: value,
        doctorId: selectedDoctor.Doctor_ID,
      }));
    }
  };

  // Handle regular input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select input
  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://192.168.136.219:4000/api/v1/create-appointment", formData);
      toast.success("Appointment created successfully!");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to create appointment.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-[600px] border-2 p-10 rounded-lg shadow-lg">
        <div className="flex flex-col gap-4">
          <Label>Doctor's name</Label>
          <Select value={formData.doctorName} onValueChange={handleDoctor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Doctors</SelectLabel>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.Doctor_ID} value={doctor.Doctor_Name}>
                    {doctor.Doctor_Name} - {doctor.Consultation_Fee} LKR
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label>Patient name</Label>
          <Input name="patientName" value={formData.patientName} onChange={handleChange} placeholder="Enter name" />

          <Label>Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label>Appointment Date</Label>
          <Input name="appointmentDate" type="date" value={formData.appointmentDate} onChange={handleChange} />

          <Label>Appointment Time</Label>
          <Input name="appointmentTime" type="time" value={formData.appointmentTime} onChange={handleChange} />

          <Label>Contact</Label>
          <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter phone number" />

          <Label>Address</Label>
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />

          <Label>Email</Label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />

          <Button type="submit" className="w-full">
            Book Appointment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Home;
