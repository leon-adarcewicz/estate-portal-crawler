# Estate Portal Crawler

Automated web scraper that monitors [Otodom](https://www.otodom.pl/) for new house listings matching specific search criteria. Built to save time during a house hunt — instead of manually refreshing search results every day, the crawler does it for you and exports a clean CSV report highlighting which listings are new since the last run.

## Why I Built This

Browsing real estate portals daily while looking for a house is tedious. Dozens of listings repeat across sessions and it's easy to miss a genuinely new one. This tool automates the search, scrapes listing details, and flags new entries so I can focus only on what changed since the last check.

## What It Does

1. Opens a Chromium browser and navigates to Otodom.
2. Applies pre-configured search filters.
3. Sorts results by newest first and scrapes listing cards — price, price per m², address, rooms, area, and link.
4. Compares scraped listings against the previous CSV report to mark each entry as **new** or **already seen**.
5. Writes everything to `crawler-results.csv` (UTF-8 with BOM for Excel compatibility).

## Tech Stack

| Tool                                          | Purpose                       |
| --------------------------------------------- | ----------------------------- |
| [Playwright](https://playwright.dev/)         | Browser automation & scraping |
| [fast-csv](https://c2fo.github.io/fast-csv/)  | CSV reading and writing       |
| [Pino](https://getpino.io/)                   | Structured logging            |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                   |

## Project Structure

```
src/
├── index.ts       # Entry point — orchestrates read → crawl → merge → write
├── crawler.ts     # Playwright automation on Otodom (search + card scraping)
├── csv_svc.ts     # Read/write CSV reports via fast-csv
├── types.ts       # Card, Row, and CSVRow type definitions
├── utils.ts       # String helpers and new-vs-seen comparison logic
└── logger.ts      # Pino logger configuration
tests/
└── example.spec.ts  # Playwright test that runs the scraper
```

## Prerequisites

- **Node.js** ≥ 18
- **npm**

## Setup

```bash
# Clone the repository
git clone https://github.com/leon-adarcewicz/estate-portal-crawler.git
cd estate-portal-crawler

# Install dependencies
npm install

# Install Playwright browsers (at minimum Chromium)
npx playwright install chromium
```

## Usage

### Run the crawler (recommended)

```bash
npm start
```

This executes `tsx src/index.ts`, which:

- Reads the existing `crawler-results.csv` (if present).
- Launches a **visible** Chromium window and scrapes Otodom.
- Merges results, marking previously seen listings.
- Writes the updated CSV.

> **First run:** If `crawler-results.csv` doesn't exist yet, the read step will fail. Create an empty file first or run through the Playwright test path below on the initial run.

### Run via Playwright test runner

```bash
npm run crawl
```

Runs the scraper as a Playwright test (`tests/example.spec.ts`) with the Chromium project. This path writes a fresh CSV without the new-vs-seen merge logic.

## CSV Output

The report is written to `crawler-results.csv` in the project root (gitignored). Columns:

| Column       | Description                                          |
| ------------ | ---------------------------------------------------- |
| Cena dom     | Total listing price                                  |
| cena w       | Price currency/unit                                  |
| Cena za metr | Price per m²                                         |
| jedn.        | Unit label                                           |
| Adres        | Address                                              |
| Pokoje       | Number of rooms                                      |
| Powierzchnia | Area in m²                                           |
| Link         | Full URL to the listing on Otodom                    |
| Nowe         | Empty if already seen, **Nie** if it's a new listing |

## Customising Search Filters

The search parameters (location, price range, area range, property type) are currently hard-coded in `src/crawler.ts` inside the `getAdvCards` function. To change them, edit the relevant `page.getByText(...)` / `page.fill(...)` calls to match your criteria.

## Known Limitations

- **Single portal only** — currently targets Otodom; no multi-portal abstraction.
- **Hard-coded Polish UI selectors** — Otodom A/B tests or redesigns may break selectors.
- **No first-run guard** — the main path expects an existing CSV file on disk.
- **Browser not explicitly closed** — `crawler.ts` does not call `browser.close()` after scraping; the process exit handles cleanup.

## License

ISC
