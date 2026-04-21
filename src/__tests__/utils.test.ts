import { returnNumbers, returnNotNumbers, convertCardsToCSVRows } from "../utils";
import type { Card } from "../types";
import { describe, it, expect, jest } from "@jest/globals";

jest.mock("logger", () => ({
  __esModule: true,
  default: { info: jest.fn() },
}));

describe("returnNumbers", () => {
  it("extracts digits from a mixed string", () => {
    expect(returnNumbers("abc123def456")).toBe("123456");
  });

  it("returns empty string when no digits present", () => {
    expect(returnNumbers("abcdef")).toBe("");
  });

  it("strips spaces and special characters", () => {
    expect(returnNumbers("1 200 000 zł")).toBe("1200000");
  });
});

describe("returnNotNumbers", () => {
  it("removes digits from a mixed string", () => {
    expect(returnNotNumbers("abC123def456")).toBe("abCdef");
  });

  it("returns empty string when all digits", () => {
    expect(returnNotNumbers("12345")).toBe("");
  });

  it("preserves spaces and special characters", () => {
    expect(returnNotNumbers("1 200 000 zł")).toBe("   zł");
  });
});

describe("convertCardsToCSVRows", () => {
  const baseCard: Card = {
    totalPrice: 500000,
    totalPriceUnit: "zł",
    sqMPrice: 10000,
    unitPrice: "zł/m²",
    address: "Warszawa, Mokotów",
    rooms: 3,
    area: 50,
    link: "https://example.com/offer/1",
  };

  it("marks a card as viewed when it exists in oldCards", () => {
    const cards: Card[] = [baseCard];
    const oldCards: Card[] = [baseCard];

    const rows = convertCardsToCSVRows(cards, oldCards);

    expect(rows).toHaveLength(1);
    expect(rows[0]!.viewed).toBe(true);
  });

  it("marks a card as not viewed when absent from oldCards", () => {
    const cards: Card[] = [baseCard];

    const rows = convertCardsToCSVRows(cards, []);

    expect(rows).toHaveLength(1);
    expect(rows[0]!.viewed).toBe(false);
  });

  it("handles multiple cards with mixed viewed status", () => {
    const card2: Card = { ...baseCard, link: "https://example.com/offer/2" };
    const cards: Card[] = [baseCard, card2];
    const oldCards: Card[] = [baseCard];

    const rows = convertCardsToCSVRows(cards, oldCards);

    expect(rows).toHaveLength(2);
    expect(rows[0]!.viewed).toBe(true);
    expect(rows[1]!.viewed).toBe(false);
  });

  it("returns empty array when given no cards", () => {
    const rows = convertCardsToCSVRows([], []);
    expect(rows).toEqual([]);
  });
});
