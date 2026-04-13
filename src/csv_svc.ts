import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as csv from "fast-csv";
import logger from "logger";
import type { Card, CSVRow, Row } from "types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createReport(cards: Row[]): Promise<void> {
  logger.info({ count: cards.length }, "Writing cards to CSV");
  return new Promise((resolve, reject) => {
    const csvStream = csv
      .format<Row, CSVRow>({ headers: true, writeBOM: true })
      .transform((card: Row) => ({
        "Cena dom": card.totalPrice,
        "cena w": card.totalPriceUnit,
        "Cena za metr": card.sqMPrice,
        "jedn.": card.unitPrice,
        Adres: card.address,
        Pokoje: card.rooms,
        Powierzchnia: card.area,
        test: "test",
        Link: card.link,
        Nowe: card.viewed ? "" : "Nie",
      }));

    const writeStream = fs.createWriteStream(path.resolve(__dirname, "../", "crawler-results.csv"));

    csvStream
      .pipe(writeStream)
      .on("finish", () => {
        logger.info("Done writing CSV");
        resolve();
      })
      .on("error", reject);

    cards.forEach((card) => {
      csvStream.write(card);
    });
    csvStream.end();
  });
}

export function readReport(): Promise<Card[]> {
  logger.info("Reading CSV");
  return new Promise((resolve, reject) => {
    const cards: Card[] = [];
    fs.createReadStream(path.resolve(__dirname, "../", "crawler-results.csv"))
      .pipe(csv.parse<CSVRow, Card>({ headers: true }))
      .transform((row: CSVRow) => ({
        totalPrice: row["Cena dom"],
        totalPriceUnit: row["cena w"],
        sqMPrice: row["Cena za metr"],
        unitPrice: row["jedn."],
        address: row.Adres,
        rooms: row.Pokoje,
        area: row.Powierzchnia,
        link: row.Link,
      }))
      .on("error", (error) => reject(error))
      .on("data", (row) => cards.push(row))
      .on("end", () => resolve(cards));
  });
}
