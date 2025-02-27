import axios from "../axios";

export interface OrderItem {
  dishName: string;
  price: number;
  quantity: number;
}

export interface OrderDetails {
  _id: string;
  shopId: string;
  table: string;
  tax: number;
  orderType: string;
  paymentType: string;
  orders: OrderItem[];
  totalPrice: number;
  finalPrice: number;
  paidPrice: number;
  extraChange: number;
  createdAt: string;
  updatedAt: string;
}

export const fetchOrderDetails = async (
  orderId: string
): Promise<OrderDetails> => {
  try {
    const response = await axios.get(`/api/v1/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
