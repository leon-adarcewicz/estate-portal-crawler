import crawlOtoDom from "crawler";
import { createReport } from "csv_svc";

async function main() {
  const cards = await crawlOtoDom();
  createReport(cards);
}

await main();
process.exit(0);
