export type Row = {
  totalPrice: number;
  totalPriceUnit: string;
  sqMPrice: number;
  unitPrice: string;
  address: string;
  rooms: number;
  area: number;
  link: string;
  viewed: boolean;
};

export type CSVRow = {
  "Cena dom": number;
  "cena w": string;
  "Cena za metr": number;
  "jedn.": string;
  Adres: string;
  Pokoje: number;
  Powierzchnia: number;
  Link: string;
  Nowe: string;
};

export type Card = Omit<Row, "viewed">;
