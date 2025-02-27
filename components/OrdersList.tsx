import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import {
  Order,
  fetchOrdersByDateRange,
} from "../utils/ordermanagement/fetchOrdersByDateRange";
import { formatDateTimeForDisplay } from "@/utils/dateFormatter";

interface OrdersListProps {
  startDate: string | null;
  endDate: string | null;
  selectAll: boolean;
  onSelectAll: (value: boolean) => void;
}

const OrdersList = ({ startDate, endDate, selectAll, onSelectAll }: OrdersListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadOrders = async () => {
      if (!startDate || !endDate) return;

      try {
        setIsLoading(true);
        const orderData = await fetchOrdersByDateRange(startDate, endDate);
        setOrders(orderData);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectAll) {
      setSelectedOrders(new Set(orders.map(order => order._id)));
    } else {
      setSelectedOrders(new Set());
    }
  }, [selectAll, orders]);

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
      if (selectAll) {
        onSelectAll(false);
      }
    } else {
      newSelected.add(orderId);
      if (newSelected.size === orders.length) {
        onSelectAll(true);
      }
    }
    setSelectedOrders(newSelected);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-gray-500">Loading orders...</Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-8">
        <Text className="text-gray-500">
          {startDate && endDate
            ? "No orders found for selected dates"
            : "Please select a date range"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      {orders.map((order, index) => (
        <View
          key={order._id}
          className={`flex-row items-center px-4 py-7 border-b border-gray-200 mx-4 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-100"
          }`}
        >
          <TouchableOpacity 
            style={{ width: "10%" }}
            onPress={() => toggleOrderSelection(order._id)}
          >
            <View className={`h-5 w-5 border rounded flex items-center justify-center ${
              selectedOrders.has(order._id) 
                ? "bg-orange-500 border-orange-500" 
                : "border-gray-300"
            }`}>
              {selectedOrders.has(order._id) && (
                <Text className="text-white text-xs">✓</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text className="text-xl text-gray-800" style={{ width: "10%" }}>
            {index + 1}
          </Text>
          <Text
            className="text-xl text-center text-gray-800"
            style={{ width: "50%" }}
          >
            {formatDateTimeForDisplay(order.createdAt)}
          </Text>
          <Text
            className="text-center text-xl text-gray-800"
            style={{ width: "40%" }}
          >
            {order.finalPrice.toLocaleString()} Ks
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default OrdersList;
