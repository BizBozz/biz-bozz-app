import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { router } from "expo-router";
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
  onDeleteSuccess: () => void;
  onSelectedOrdersChange: (orders: Set<string>) => void;
  shouldRefetch: boolean;
  onRefetchComplete: () => void;
}

const OrdersList = forwardRef(
  (
    {
      startDate,
      endDate,
      selectAll,
      onSelectAll,
      onDeleteSuccess,
      onSelectedOrdersChange,
      shouldRefetch,
      onRefetchComplete,
    }: OrdersListProps,
    ref
  ) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(
      new Set()
    );

    useEffect(() => {
      loadOrders();
    }, [startDate, endDate]);

    useEffect(() => {
      if (shouldRefetch) {
        loadOrders();
        onRefetchComplete();
      }
    }, [shouldRefetch]);

    const loadOrders = async () => {
      if (!startDate || !endDate) return;

      try {
        setIsLoading(true);
        const orderData = await fetchOrdersByDateRange(startDate, endDate);
        setOrders(orderData);
      } catch (error) {
        console.error("Failed to load orders:", error);
        Alert.alert("Error", "Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      loadOrders,
    }));

    useEffect(() => {
      if (selectAll) {
        const newSelected = new Set(orders.map((order) => order._id));
        setSelectedOrders(newSelected);
        onSelectedOrdersChange(newSelected);
      } else {
        setSelectedOrders(new Set());
        onSelectedOrdersChange(new Set());
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
      onSelectedOrdersChange(newSelected);
    };

    const handleOrderPress = (orderId: string) => {
      router.push({
        pathname: "/(app)/order/[id]/page",
        params: { id: orderId },
      });
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
          <TouchableOpacity
            key={order._id}
            onPress={() => handleOrderPress(order._id)}
            className={`flex-row items-center px-4 py-7 border-b border-gray-200 mx-4 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            }`}
          >
            <TouchableOpacity
              style={{ width: "10%" }}
              onPress={(e) => {
                e.stopPropagation();
                toggleOrderSelection(order._id);
              }}
            >
              <View
                className={`h-5 w-5 border rounded flex items-center justify-center ${
                  selectedOrders.has(order._id)
                    ? "bg-orange-500 border-orange-500"
                    : "border-gray-300"
                }`}
              >
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
              style={{ width: "30%" }}
            >
              {order.finalPrice.toLocaleString()} Ks
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }
);

export default OrdersList;
