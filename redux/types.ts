export interface Receipt {
  items: Array<{
    id: string;
    dishName: string;
    price: number;
    quantity: number;
  }>;
  orderType?: string;
}

export interface ReceiptState {
  selectedTable: number | null;
  receipts: {
    [key: number]: Receipt;
  };
}

export interface RootState {
  receipts: ReceiptState;
}
