import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
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
  for (let card of await advertCards.all()) {
    const price = await card.locator('[data-sentry-component="CustomizedPrice"]').innerText();
    console.log(price);
  }
  await expect(advertCards).toHaveCount(72);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole("heading", { name: "Installation" })).toBeVisible();
});
