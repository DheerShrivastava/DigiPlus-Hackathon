import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { connectDB } from "../config/db.js";
import Booking from "../models/Booking.js";
import Hoarding from "../models/Hoarding.js";
import Customer from "../models/Customer.js";

export async function importBookings(filePath) {
  try {
    await connectDB();

    const csvPath = filePath || path.join(process.cwd(), "imports", "bookings.csv");
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
      if (!row.bookingId || !row.hoardingId || !row.customerId) {
        invalid++;
        continue;
      }

      // Find references
      const hoardingDoc = await Hoarding.findOne({ hoardingId: row.hoardingId });
      const customerDoc = await Customer.findOne({ customerId: row.customerId });

      if (!hoardingDoc || !customerDoc) {
        invalid++;
        continue;
      }

      const bookingData = {
        bookingId: row.bookingId,
        hoardingId: hoardingDoc._id,
        customerId: customerDoc._id,
        startDate: row.startDate ? new Date(row.startDate) : new Date(),
        endDate: row.endDate ? new Date(row.endDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        monthlyRate: parseFloat(row.monthlyRate) || hoardingDoc.monthlyRate,
        totalRevenue: parseFloat(row.totalRevenue) || (hoardingDoc.monthlyRate * 3),
        status: row.status || "ACTIVE",
        campaignName: row.campaignName || "OOH Brand Push",
        industry: row.industry || customerDoc.industry
      };

      const result = await Booking.findOneAndUpdate(
        { bookingId: row.bookingId },
        { $set: bookingData },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updated++;
      } else {
        inserted++;
      }
    }

    console.log("\n=================================");
    console.log("CSV Import Complete - Bookings");
    console.log("=================================");
    console.log(`Total Records Processed: ${records.length}`);
    console.log(`New Inserted:           ${inserted}`);
    console.log(`Updated / Deduplicated: ${updated}`);
    console.log(`Invalid Records:        ${invalid}`);
    console.log("=================================\n");

  } catch (err) {
    console.error("❌ Booking CSV Import Error:", err.message);
  }
}

if (process.argv[1]?.endsWith("importBookings.js")) {
  importBookings().then(() => process.exit(0));
}
