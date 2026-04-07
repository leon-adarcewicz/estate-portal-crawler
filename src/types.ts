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

export type Card = Omit<Row, "viewed">;
