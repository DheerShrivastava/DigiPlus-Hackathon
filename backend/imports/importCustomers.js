import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { connectDB } from "../config/db.js";
import Customer from "../models/Customer.js";

export async function importCustomers(filePath) {
  try {
    await connectDB();

    const csvPath = filePath || path.join(process.cwd(), "imports", "customers.csv");
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
      if (!row.name || !row.companyName || !row.industry) {
        invalid++;
        continue;
      }

      const customerData = {
        customerId: row.customerId || `CUST-${Math.floor(100 + Math.random() * 900)}`,
        name: row.name,
        companyName: row.companyName,
        industry: row.industry,
        email: row.email || `contact@${row.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: row.phone || "+91 98200 00000",
        budgetMin: parseFloat(row.budgetMin) || 500000,
        budgetMax: parseFloat(row.budgetMax) || 2000000,
        budgetBand: row.budgetBand || "₹5L - ₹20L / mo",
        relationshipScore: parseInt(row.relationshipScore) || 80,
        totalBookings: parseInt(row.totalBookings) || 5,
        totalSpend: parseFloat(row.totalSpend) || 2500000,
        customerStatus: row.customerStatus || "ACTIVE"
      };

      const result = await Customer.findOneAndUpdate(
        { companyName: row.companyName },
        { $set: customerData },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updated++;
      } else {
        inserted++;
      }
    }

    console.log("\n=================================");
    console.log("CSV Import Complete - Customers");
    console.log("=================================");
    console.log(`Total Records Processed: ${records.length}`);
    console.log(`New Inserted:           ${inserted}`);
    console.log(`Updated / Deduplicated: ${updated}`);
    console.log(`Invalid Records:        ${invalid}`);
    console.log("=================================\n");

  } catch (err) {
    console.error("❌ Customer CSV Import Error:", err.message);
  }
}

if (process.argv[1]?.endsWith("importCustomers.js")) {
  importCustomers().then(() => process.exit(0));
}
