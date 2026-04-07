import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as csv from "fast-csv";
import logger from "logger";
import type { Card } from "types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createReport(cards: Card[]) {
  const csvStream = csv
    .format<Card, Card>({ headers: true, writeBOM: true })
    .transform((card: Card) => ({
      "Cena dom": card.totalPrice,
      "cena w": card.totalPriceUnit,
      "Cena za metr": card.sqMPrice,
      "jedn.": card.unitPrice,
      Adres: card.address,
      Pokoje: card.rooms,
      Powierzchnia: card.area,
      Link: card.link,
    }));
  const writeStream = fs.createWriteStream(path.resolve(__dirname, "../", "crawler-results.csv"));

  csvStream.pipe(writeStream).on("finish", () => logger.info("Done writing CSV"));

  logger.info({ count: cards.length }, "Writing cards to CSV");
  cards.forEach((card) => {
    csvStream.write(card);
  });
  csvStream.end();
}
