import dotenv from "dotenv";
dotenv.config();

import { importHoardings } from "./importHoardings.js";
import { importCustomers } from "./importCustomers.js";
import { importBookings } from "./importBookings.js";

async function runImportAll() {
  console.log(" Starting Full CSV Data Import Pipeline...\n");
  await importHoardings();
  await importCustomers();
  await importBookings();
  console.log("🎉 ALL CSV IMPORTS COMPLETED SUCCESSFULLY!");
  process.exit(0);
}

runImportAll();
