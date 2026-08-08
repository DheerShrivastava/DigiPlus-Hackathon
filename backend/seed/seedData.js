import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

import Hoarding from "../models/Hoarding.js";
import Customer from "../models/Customer.js";
import Booking from "../models/Booking.js";
import Lead from "../models/Lead.js";
import Outreach from "../models/Outreach.js";

const cityAreas = [
  // Mumbai
  { city: "Mumbai", name: "Worli Sea Link Flyover", lat: 19.0176, lng: 72.8172 },
  { city: "Mumbai", name: "BKC G-Block Junction", lat: 19.0657, lng: 72.8687 },
  { city: "Mumbai", name: "Lower Parel Palladium Mall", lat: 19.0006, lng: 72.8277 },
  { city: "Mumbai", name: "Andheri WEH Metro Junction", lat: 19.1197, lng: 72.8468 },
  { city: "Mumbai", name: "Bandra Promenade Hill Road", lat: 19.0607, lng: 72.8362 },
  { city: "Mumbai", name: "Powai Hiranandani Gardens", lat: 19.1176, lng: 72.9060 },

  // Delhi NCR
  { city: "Delhi", name: "Connaught Place Outer Circle", lat: 28.6315, lng: 77.2167 },
  { city: "Delhi", name: "Cyber Hub Main Entry Boulevard, Gurugram", lat: 28.4950, lng: 77.0895 },
  { city: "Delhi", name: "South Extension Ring Road Flyover", lat: 28.5684, lng: 77.2215 },
  { city: "Delhi", name: "Noida Sector 18 Market Entry", lat: 28.5708, lng: 77.3261 },

  // Bengaluru
  { city: "Bengaluru", name: "Indiranagar 100ft Road Signal", lat: 12.9784, lng: 77.6408 },
  { city: "Bengaluru", name: "Koramangala 80ft Road Sony Junction", lat: 12.9352, lng: 77.6245 },
  { city: "Bengaluru", name: "MG Road Metro Station Facing", lat: 12.9756, lng: 77.6066 },
  { city: "Bengaluru", name: "Electronic City Flyover Toll Entry", lat: 12.8452, lng: 77.6602 },

  // Hyderabad
  { city: "Hyderabad", name: "HITEC City Mindspace Flyover", lat: 17.4435, lng: 78.3772 },
  { city: "Hyderabad", name: "Jubilee Hills Check Post", lat: 17.4319, lng: 78.4072 },
  { city: "Hyderabad", name: "Banjara Hills Road No. 1", lat: 17.4156, lng: 78.4485 },

  // Pune
  { city: "Pune", name: "Viman Nagar Airport Road Exit", lat: 18.5679, lng: 73.9143 },
  { city: "Pune", name: "Koregaon Park North Main Road", lat: 18.5362, lng: 73.8940 },
  { city: "Pune", name: "Hinjewadi Phase 1 IT Park Entry", lat: 18.5912, lng: 73.7389 }
];

const industries = [
  "Quick Commerce & Retail",
  "Consumer Electronics",
  "Automotive & CleanTech",
  "Fintech & Banking",
  "E-Commerce & Technology",
  "Food & Beverage",
  "Entertainment & OTT",
  "Real Estate",
  "Healthcare & Wellness"
];

const sizes = [
  "40ft x 20ft (Illuminated Frame)",
  "60ft x 30ft (Illuminated Unipole)",
  "80ft x 40ft (Digital 4K LED Screen)",
  "50ft x 25ft (Frontlit Billboard)",
  "70ft x 35ft (Dual Side LED Unipole)"
];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seedDatabase() {
  try {
    await connectDB();

    console.log("🧹 Wiping old collections...");
    await Hoarding.deleteMany({});
    await Customer.deleteMany({});
    await Booking.deleteMany({});
    await Lead.deleteMany({});
    await Outreach.deleteMany({});

    console.log("🌱 Creating 100 Customers...");
    const customerDocs = [];
    for (let i = 1; i <= 100; i++) {
      const ind = randomItem(industries);
      const minB = random(400000, 1500000);
      const maxB = minB + random(500000, 3000000);

      customerDocs.push({
        customerId: `CUST-${String(i).padStart(3, "0")}`,
        name: `Lead Exec ${i}`,
        companyName: `${ind.split(' ')[0]} Brand ${i}`,
        industry: ind,
        email: `marketing@brand${i}.com`,
        phone: `+91 98200 ${String(10000 + i).padStart(5, "0")}`,
        budgetMin: minB,
        budgetMax: maxB,
        budgetBand: `₹${(minB / 100000).toFixed(0)}L - ₹${(maxB / 100000).toFixed(0)}L / mo`,
        relationshipScore: random(50, 99),
        totalBookings: random(2, 30),
        totalSpend: random(1000000, 15000000),
        preferredCities: ["Mumbai", "Delhi", "Bengaluru"],
        preferredLocations: ["Worli", "BKC", "Cyber Hub", "Indiranagar"],
        preferredHoardingSizes: [randomItem(sizes)],
        customerStatus: "ACTIVE"
      });
    }

    const savedCustomers = await Customer.insertMany(customerDocs);
    console.log(`✅ Saved ${savedCustomers.length} Customers`);

    console.log("🌱 Creating 300 Hoardings...");
    const hoardingDocs = [];

    for (let i = 1; i <= 300; i++) {
      const area = randomItem(cityAreas);
      const trafficScore = random(60, 99);
      const occupancyRate = random(65, 98);
      const demandScore = Math.round(trafficScore * 0.4 + occupancyRate * 0.4 + random(50, 100) * 0.2);
      const monthlyRate = random(350000, 1200000);
      const vacancyDays = random(10, 150);

      const endDate = futureDate(vacancyDays);
      const freeDate = futureDate(vacancyDays + 1);

      let status = "BOOKED";
      let urgency = "moderate";

      if (vacancyDays <= 30) {
        status = "EXPIRING";
        urgency = "critical";
      } else if (vacancyDays <= 60) {
        status = "EXPIRING";
        urgency = "high";
      } else if (vacancyDays <= 90) {
        status = "EXPIRING";
        urgency = "moderate";
      } else if (Math.random() < 0.08) {
        status = "AVAILABLE";
        urgency = "critical";
      }

      let demandLevel = "High";
      if (demandScore < 70) demandLevel = "Low";
      else if (demandScore < 85) demandLevel = "Medium";

      hoardingDocs.push({
        hoardingId: `H-${String(i).padStart(3, "0")}`,
        location: `${area.name}, ${area.city}`,
        city: area.city,
        area: area.name,
        latitude: area.lat + (Math.random() - 0.5) * 0.03,
        longitude: area.lng + (Math.random() - 0.5) * 0.03,
        size: randomItem(sizes),
        width: 60,
        height: 30,
        trafficScore,
        monthlyRate,
        bookingEndDate: endDate,
        freeFromDate: freeDate,
        occupancyRate,
        bookingFrequency: `${random(12, 32)} campaigns / yr`,
        revenueGenerated: Math.round(monthlyRate * (occupancyRate / 100) * random(6, 12)),
        revenueAtRisk: Math.round(monthlyRate * random(1, 3)),
        demandScore,
        demandLevel,
        status
      });
    }

    const savedHoardings = await Hoarding.insertMany(hoardingDocs);
    console.log(`✅ Saved ${savedHoardings.length} Hoardings`);

    console.log("🌱 Creating 700 Bookings...");
    const bookingDocs = [];

    for (let i = 1; i <= 700; i++) {
      const h = randomItem(savedHoardings);
      const c = randomItem(savedCustomers);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - random(20, 500));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + random(30, 180));

      bookingDocs.push({
        bookingId: `BKG-${String(i).padStart(4, "0")}`,
        hoardingId: h._id,
        customerId: c._id,
        startDate,
        endDate,
        monthlyRate: h.monthlyRate,
        totalRevenue: Math.round(h.monthlyRate * random(1, 4)),
        status: endDate < new Date() ? "COMPLETED" : "ACTIVE",
        campaignName: `${c.industry} Launch Q${random(1, 4)}`,
        industry: c.industry
      });
    }

    const savedBookings = await Booking.insertMany(bookingDocs);
    console.log(`✅ Saved ${savedBookings.length} Bookings`);

    console.log("");
    console.log("🎉 SEED COMPLETED SUCCESSFULLY!");
    console.log(`Summary: ${savedHoardings.length} Hoardings | ${savedCustomers.length} Customers | ${savedBookings.length} Bookings`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seedDatabase();