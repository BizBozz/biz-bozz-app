import axios from "./axios";

interface OrderItem {
  dishName: string;
  price: number;
  quantity: number;
}

interface PaymentData {
  table: string;
  tax: number;
  orderType: "Dine In" | "Take Away";
  paymentType: "Cash" | "Card";
  orders: OrderItem[];
  totalPrice: number;
  finalPrice: number;
  paidPrice: number;
  extraChange: number;
}

export const handlePayment = async (data: PaymentData) => {
  try {
    const response = await axios.post(`api/v1/orders`, data);
    // Here you would typically make an API call to your backend
    // For now, we'll just log the data
    console.log("Payment processed:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Payment failed:", error);
    throw error;
  }
};
