import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as csv from "fast-csv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csvStream = csv.format({ headers: true });
const writeStream = fs.createWriteStream(path.resolve(__dirname, "../", "crawler-results.csv"));

csvStream.pipe(writeStream).on("finish", () => console.log("Done writing CSV"));

csvStream.write({ name: "Test Property", price: 500000, city: "Warsaw" });
csvStream.write({ name: "Another Property", price: 750000, city: "Krakow" });
csvStream.end();
