import crawlOtoDom from "crawler";
import { createReport, readReport } from "csv_svc";
import { convertCardsToCSVRows } from "utils";

async function main() {
  const oldCards = await readReport();
  const cards = await crawlOtoDom();
  const new_rows = convertCardsToCSVRows(cards, oldCards);
  await createReport(new_rows);
}

await main();
process.exit(0);
