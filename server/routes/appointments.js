import express from "express";
import Appointment from "../models/Appointment.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/role.js";

const router = express.Router();

// ✅ GET - Coach/User: View own appointments
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ user: userId }).sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user appointments" });
  }
});

// ✅ GET - Admin: View all appointments
router.get("/admin/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("user", "name email role");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// ✅ POST - Create appointment
router.post("/", requireAuth, async (req, res) => {
  try {
    const { serviceType, date, notes } = req.body;

    const newAppointment = new Appointment({
      user: req.user.id, // Link appointment to current user
      serviceType,
      date,
      notes,
      status: "Scheduled"
    });

    const saved = await newAppointment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating appointment:", err.message);
    res.status(500).json({ message: "Failed to create appointment" });
  }
});

export default router;

