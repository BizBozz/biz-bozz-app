import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import {
  OrderDetails,
  fetchOrderDetails,
} from "../../../../utils/ordermanagement/fetchOrderDetails";
import { updateOrder } from "../../../../utils/ordermanagement/updateOrder";
import { formatDateTimeForDisplay } from "../../../../utils/dateFormatter";
import AlertModal from "@/app/components/AlertModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { RootState } from "@/redux/types";
import {
  setCurrentOrder,
  incrementOrderItem,
  decrementOrderItem,
  clearOrderEdited,
} from "@/redux/orderSlice";

export default function OrderDetailPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.order.currentOrder);
  const isEdited = useSelector((state: RootState) => state.order.isEdited);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
    buttons: [] as { text: string; onPress: () => void; style?: string }[],
  });

  useEffect(() => {
    loadOrderDetails();
  }, [id]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      const details = await fetchOrderDetails(id as string);
      dispatch(setCurrentOrder(details));
    } catch (error) {
      console.error("Failed to load order details:", error);
      showErrorAlert("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessAlert = (message: string) => {
    setAlert({
      visible: true,
      title: "Success",
      message,
      buttons: [
        {
          text: "OK",
          onPress: () => setAlert((prev) => ({ ...prev, visible: false })),
        },
      ],
    });
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 1000);
  };

  const showErrorAlert = (message: string) => {
    setAlert({
      visible: true,
      title: "Error",
      message,
      buttons: [
        {
          text: "OK",
          onPress: () => setAlert((prev) => ({ ...prev, visible: false })),
        },
      ],
    });
  };

  const handleSave = async () => {
    if (!order || !isEdited) return;

    try {
      setIsLoading(true);
      await updateOrder(order._id, {
        orders: order.orders,
        tax: order.tax,
        totalPrice: order.totalPrice,
        finalPrice: order.finalPrice,
      });
      showSuccessAlert("Order updated successfully");
      dispatch(clearOrderEdited());
      // Navigate back to refresh order list
      setTimeout(() => router.back(), 1000);
    } catch (error) {
      console.error("Failed to update order:", error);
      showErrorAlert("Failed to update order");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading order details..." />;
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
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FF6F00" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold">Order Details</Text>
          </View>
          {isEdited && (
            <TouchableOpacity
              className="px-4 py-2 bg-primary rounded-full"
              onPress={handleSave}
            >
              <Text className="text-white font-medium">Save Changes</Text>
            </TouchableOpacity>
          )}
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
        <View className="flex-row justify-between items-center mb-6">
          <Text className="font-semibold text-xl">Ordered Dishes</Text>
          <TouchableOpacity
            className="px-4 py-2 bg-orange-100 rounded-full"
            onPress={() =>
              router.push({
                pathname: "/(app)/order/addmoreitem",
                params: { id: order._id },
              })
            }
          >
            <Text className="text-primary font-medium">Add More Items</Text>
          </TouchableOpacity>
        </View>
        <ScrollView className="mb-6">
          {order.orders.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold w-28">{item.dishName}</Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => dispatch(decrementOrderItem(item.dishName))}
                  >
                    <Feather name="minus-circle" size={24} color="orange" />
                  </TouchableOpacity>
                  <Text className="font-semibold">{item.quantity} pcs</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(incrementOrderItem(item.dishName))}
                  >
                    <Feather name="plus-circle" size={24} color="orange" />
                  </TouchableOpacity>
                </View>
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

      <AlertModal
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
      />
    </SafeAreaView>
  );
}
