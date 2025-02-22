export interface MenuItem {
  id: string;
  dishName: string;
  price: number;
  categoryName: string;
  description?: string;
  image?: string;
  items?: MenuItem[];
}

export interface MenuResponse {
  code: number;
  data: MenuItem[];
  message?: string;
}

export interface Receipt {
  items: {
    id: string;
    dishName: string;
    price: number;
    quantity: number;
  }[];
}

export interface ReceiptState {
  selectedTable: number | null;
  receipts: {
    [key: number]: Receipt;
  };
}
