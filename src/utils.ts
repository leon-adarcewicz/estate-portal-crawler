import logger from "logger";
import type { Card, Row } from "types";

export function returnNumbers(text: string) {
  return text.replaceAll(/\D/g, "");
}

export function returnNotNumbers(text: string) {
  return text.replaceAll(/\d/g, "");
}

export function convertCardsToCSVRows(cards: Card[], oldCards: Card[]): Row[] {
  logger.info(
    { newCount: cards.length, oldCount: oldCards.length },
    "Converting cards to CSV rows",
  );
  return cards.map((card) => {
    const oldCard = oldCards.find((c) => c.link === card.link);
    return {
      ...card,
      viewed: !!oldCard,
    };
  });
}
