import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  OrderDetails,
  fetchOrderDetails,
} from "../../../../utils/ordermanagement/fetchOrderDetails";
import { formatDateTimeForDisplay } from "../../../../utils/dateFormatter";

export default function OrderDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const details = await fetchOrderDetails(id as string);
      console.log("details", details);
      setOrder(details);
    } catch (error) {
      console.error("Failed to load order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Order not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-4">
            <Text className="text-3xl font-bold">Order Details</Text>
          </View>
        </View>

        {/* Order Info */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">
            Table {order.table}
          </Text>
          <Text className="text-gray-600 mb-2">
            {formatDateTimeForDisplay(order.createdAt)}
          </Text>
        </View>

        {/* Order Type */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={
                order.orderType === "Dine In" ? "checkbox" : "square-outline"
              }
              size={20}
              color="#FF6B00"
            />
            <Text>Dine In</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={
                order.orderType === "Take Away" ? "checkbox" : "square-outline"
              }
              size={20}
              color="#FF6B00"
            />
            <Text>Take Away</Text>
          </View>
        </View>

        {/* Ordered Items */}
        <Text className="font-semibold text-xl mb-6">Ordered Dishes</Text>
        <ScrollView className="mb-6">
          {order.orders.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold w-28">{item.dishName}</Text>
                <Text className="font-semibold">{item.quantity} pcs</Text>
                <Text className="font-semibold w-24 text-right">
                  {(item.price * item.quantity).toLocaleString()} Ks
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Section */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        {/* Totals */}
        <View className="border-b border-gray-200 pb-4 gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Sub Total</Text>
            <Text className="font-semibold">
              {order.totalPrice.toLocaleString()} Ks
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">
              Government Tax ({order.tax * 100}%)
            </Text>
            <Text className="font-semibold">
              {(order.finalPrice - order.totalPrice).toLocaleString()} Ks
            </Text>
          </View>
          <View className="flex-row justify-between border-t border-gray-200 pt-4">
            <Text className="font-bold text-xl">Total</Text>
            <Text className="font-bold text-xl">
              {order.finalPrice.toLocaleString()} Ks
            </Text>
          </View>
        </View>

        {/* Payment Info */}
        <View className="mt-4 gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Payment Type</Text>
            <Text className="font-semibold">{order.paymentType}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Paid Amount</Text>
            <Text className="font-semibold">
              {order.paidPrice.toLocaleString()} Ks
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Change</Text>
            <Text className="font-semibold">
              {order.extraChange.toLocaleString()} Ks
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
