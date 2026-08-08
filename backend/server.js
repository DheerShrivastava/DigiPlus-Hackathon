import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import hoardingRoutes from "./routes/hoardingRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import outreachRoutes from "./routes/outreachRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import importRoutes from "./routes/importRoutes.js";

const app = express();

// Security Headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS Policy
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

// Body Parsing
app.use(express.json({ limit: "5mb" }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use("/api/", apiLimiter);

// API Route Handlers
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hoardings", hoardingRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/outreach", outreachRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/import", importRoutes);

// Health Check Endpoint (Section 34)
app.get("/api/health", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const isAiConfigured = Boolean(process.env.GEMINI_API_KEY);

  res.json({
    success: true,
    message: "Backend is healthy",
    database: isDbConnected ? "connected" : "disconnected",
    ai: isAiConfigured ? "configured" : "not_configured"
  });
});

// Root Greeting
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Leads Agent for Hoardings API Service 🚀"
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Connect DB & Start Server
await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});