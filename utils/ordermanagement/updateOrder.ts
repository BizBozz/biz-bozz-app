import axios from "../axios";
import { OrderDetails } from "./fetchOrderDetails";

export interface UpdateOrderPayload {
  orders: {
    dishName: string;
    price: number;
    quantity: number;
  }[];
  tax: number;
  totalPrice: number;
  finalPrice: number;
}

export const updateOrder = async (
  orderId: string,
  payload: UpdateOrderPayload
): Promise<OrderDetails> => {
  try {
    const response = await axios.put(`/api/v1/orders/${orderId}`, payload);
    // console.log("update", response);
    return response.data.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};
