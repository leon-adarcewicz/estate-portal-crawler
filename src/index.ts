import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as csv from "fast-csv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type Card = {
  totalPrice: string;
  totalPriceUnit: string;
  sqMPrice: string;
  unitPrice: string;
  address: string;
  rooms: string;
  area: number;
  link: string;
};

export function createReport(cards: Card[]) {
  const csvStream = csv.format({ headers: true, writeBOM: true });
  const writeStream = fs.createWriteStream(path.resolve(__dirname, "../", "crawler-results.csv"));

  csvStream.pipe(writeStream).on("finish", () => console.log("Done writing CSV"));

  cards.forEach((card) => {
    csvStream.write(card);
  });
  csvStream.end();
}

export function returnNumbers(text: string) {
  return text.replaceAll(/\D/g, "");
}

export function returnNotNumbers(text: string) {
  return text.replaceAll(/\d/g, "");
}
