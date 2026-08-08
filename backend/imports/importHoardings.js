import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { connectDB } from "../config/db.js";
import Hoarding from "../models/Hoarding.js";

export async function importHoardings(filePath) {
  try {
    await connectDB();

    const csvPath = filePath || path.join(process.cwd(), "imports", "hoardings.csv");
    if (!fs.existsSync(csvPath)) {
      console.log(`⚠️ CSV file not found at ${csvPath}`);
      return;
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let inserted = 0;
    let updated = 0;
    let invalid = 0;

    for (const row of records) {
      if (!row.hoardingId || !row.location || !row.monthlyRate) {
        invalid++;
        continue;
      }

      const hoardingData = {
        hoardingId: row.hoardingId,
        location: row.location,
        city: row.city || "Mumbai",
        area: row.area || row.city || "Urban",
        latitude: parseFloat(row.latitude) || 19.0760,
        longitude: parseFloat(row.longitude) || 72.8777,
        size: row.size || "60ft x 30ft",
        trafficScore: parseInt(row.trafficScore) || 80,
        monthlyRate: parseFloat(row.monthlyRate),
        occupancyRate: parseInt(row.occupancyRate) || 85,
        demandScore: parseInt(row.demandScore) || 88,
        demandLevel: row.demandLevel || "High",
        status: row.status || "EXPIRING",
        revenueAtRisk: parseFloat(row.monthlyRate) * 2,
        bookingEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        freeFromDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000)
      };

      const result = await Hoarding.findOneAndUpdate(
        { hoardingId: row.hoardingId },
        { $set: hoardingData },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updated++;
      } else {
        inserted++;
      }
    }

    console.log("\n=================================");
    console.log("CSV Import Complete - Hoardings");
    console.log("=================================");
    console.log(`Total Records Processed: ${records.length}`);
    console.log(`New Inserted:           ${inserted}`);
    console.log(`Updated / Deduplicated: ${updated}`);
    console.log(`Invalid Records:        ${invalid}`);
    console.log("=================================\n");

  } catch (err) {
    console.error("❌ Hoarding CSV Import Error:", err.message);
  }
}

if (process.argv[1]?.endsWith("importHoardings.js")) {
  importHoardings().then(() => process.exit(0));
}
