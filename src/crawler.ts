import type { Card } from "types";
import { chromium, type Page } from "playwright";
import logger from "logger";
import { returnNotNumbers, returnNumbers } from "utils";

async function crawlOtoDom(): Promise<Card[]> {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const cards = await getAdvCards(page);

  return cards;
}

export async function getAdvCards(page: Page): Promise<Card[]> {
  await page.goto("https://www.otodom.pl/");

  await page.getByText("Akceptuj niezbędne").click();
  await page.getByRole("combobox", { name: "Typ nieruchomości" }).click();
  await page.getByRole("option", { name: "Domy" }).click();

  await page.locator('[data-cy="search.form.location.button"]').click();
  await page.locator('[data-cy="search.form.location.input"]').fill("Poznań nowe miasto");
  await page.getByText("Nowe Miasto").first().click();

  await page.getByLabel("Cena od").click();
  await page.getByLabel("Cena od").fill("500000");
  await page.getByLabel("Cena do").click();
  await page.getByLabel("Cena do").fill("1500000");

  await page.getByLabel("Powierzchnia od").click();
  await page.getByLabel("Powierzchnia od").fill("85");
  await page.getByLabel("Powierzchnia do").click();
  await page.getByLabel("Powierzchnia do").fill("140");

  await page.locator('[data-cy="search.submit-form.results"]').click();

  await page.getByText("Domyślnie").click();
  await page.getByRole("option", { name: "Data dodania: najnowsze" }).click();

  await page.getByText("Na stronie").click();
  await page.getByRole("option", { name: "72" }).click();

  // get by data-sentry-component="AdvertCard"
  const advertCards = page.locator('[data-sentry-component="AdvertCard"]');
  const cardCount = await advertCards.count();
  logger.info({ count: cardCount }, "Found advert cards");

  const cards: Card[] = [];

  for (let card of await advertCards.all()) {
    const price = await card.locator('[data-sentry-component="CustomizedPrice"]').innerText();
    const address = await card.locator('[data-sentry-component="Address"]').innerText();
    const description = await card.locator('[data-sentry-component="DescriptionList"]').innerText();
    const link = await card.locator('[data-cy="listing-item-link"]').getAttribute("href");

    const prices = price.split("\n");
    const descriptions = description.split("\n");

    if (!prices[0] || !prices[1] || !descriptions[1] || !descriptions[3]) {
      throw new Error(
        `Invalid card data. Expected prices: ${prices[0]}, ${prices[1]}, descriptions: ${descriptions[1]}, ${descriptions[3]}`,
      );
    }

    cards.push({
      totalPrice: Number(returnNumbers(prices[0])),
      totalPriceUnit: returnNotNumbers(prices[0]).trim(),
      sqMPrice: Number(returnNumbers(prices[1])),
      unitPrice: returnNotNumbers(prices[1]).trim(),
      address,
      rooms: Number(descriptions[1].split(" ")[0]),
      area: Math.round(Number(descriptions[3].split(" ")[0])),
      link: `https://www.otodom.pl${link}`,
    });
  }

  return cards;
}

export default crawlOtoDom;
