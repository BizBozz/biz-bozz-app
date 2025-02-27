import axios from "../axios";

export interface Order {
  _id: string;
  createdAt: string;
  finalPrice: string;
}

export interface OrdersResponse {
  data: Order[];
}

export const fetchOrdersByDateRange = async (
  startDate: string,
  endDate: string
): Promise<Order[]> => {
  try {
    const response = await axios.get<OrdersResponse>(
      `api/v1/orders/range?startDate=${startDate}&endDate=${endDate}`
    );
    // console.log("Orders response:", response?.data?.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
