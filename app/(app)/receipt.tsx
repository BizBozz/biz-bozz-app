import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "@/redux/receiptSlice";
import { RootState } from "@/redux/types";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import PaymentModal from "./payment";

export default function ReceiptPage() {
  const dispatch = useDispatch();
  const selectedTable = useSelector(
    (state: RootState) => state.receipts.selectedTable
  );
  const receipt = useSelector((state: RootState) =>
    selectedTable ? state.receipts.receipts[selectedTable] : null
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [taxRate, setTaxRate] = useState("5"); // Store as string for input

  const calculateSubTotal = () => {
    if (!receipt) return 0;
    return receipt.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const subTotal = calculateSubTotal();
  const tax = subTotal * (Number(taxRate) / 100); // Convert percentage to decimal
  const total = subTotal + tax;

  if (!selectedTable || !receipt) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">No receipt available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold">Receipt</Text>
          <TouchableOpacity
            className="px-4 py-2 border border-primary rounded-full"
            onPress={() => {
              router.push("/(app)/home");
            }}
          >
            <Text className="text-primary font-medium">Save</Text>
          </TouchableOpacity>
        </View>

        {/* Table Info */}
        <Text className="text-lg font-semibold mb-2">
          Table {selectedTable}
        </Text>

        {/* Order Type */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={
                receipt.orderType === "Dine In" ? "checkbox" : "square-outline"
              }
              size={20}
              color="#FF6B00"
            />
            <Text>Dine In</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons
              name={
                receipt.orderType === "Take Away"
                  ? "checkbox"
                  : "square-outline"
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
          {receipt.items.map((item, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold w-28">{item.dishName}</Text>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => {
                      if (selectedTable) {
                        dispatch(
                          decrementQuantity({
                            table: selectedTable,
                            itemName: item.dishName,
                          })
                        );
                      }
                    }}
                  >
                    <Feather name="minus-circle" size={24} color="orange" />
                  </TouchableOpacity>
                  <Text className="font-semibold">{item.quantity} pcs</Text>
                  <TouchableOpacity
                    className=""
                    onPress={() => {
                      if (selectedTable) {
                        dispatch(
                          incrementQuantity({
                            table: selectedTable,
                            itemName: item.dishName,
                          })
                        );
                      }
                    }}
                  >
                    <Feather name="plus-circle" size={24} color="orange" />
                  </TouchableOpacity>
                </View>
                <Text className="font-semibold w-24 text-right">
                  {item.price * item.quantity} MMK
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 ">
        {/* Totals */}
        <View className="border-b border-gray-200 pb-4 gap-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Sub Total</Text>
            <Text className="font-semibold">
              {subTotal.toLocaleString()} MMK
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <Text className="text-gray-600">Government Tax</Text>
              <View className="flex-row items-center border border-gray-300 rounded px-2">
                <TextInput
                  value={taxRate}
                  onChangeText={(text) => {
                    // Only allow numbers and ensure it's not more than 100
                    const numValue = text.replace(/[^0-9]/g, '');
                    if (Number(numValue) <= 100) {
                      setTaxRate(numValue);
                    }
                  }}
                  keyboardType="numeric"
                  className="w-8 text-center"
                  maxLength={3}
                />
                <Text className="text-gray-600">%</Text>
              </View>
            </View>
            <Text className="font-semibold">{tax.toLocaleString()} MMK</Text>
          </View>
          <View className="flex-row justify-between border-t border-gray-200 pt-4">
            <Text className="font-bold text-xl">Total</Text>
            <Text className="font-bold text-xl">
              {total.toLocaleString()} MMK
            </Text>
          </View>
        </View>
        <View className="flex-row gap-4 mt-5">
          <TouchableOpacity
            className="flex-1 bg-prilight px-4 py-5 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-primary text-center font-bold text-lg">
              Order More
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-primary px-4 py-5 rounded-full"
            onPress={() => setShowPaymentModal(true)}
          >
            <Text className="text-white text-center font-bold text-lg">
              Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <PaymentModal 
        isVisible={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={total}
        subTotal={subTotal}
        taxRate={taxRate}
        selectedTable={selectedTable}
        orderType={receipt.orderType}
        items={receipt.items}
      />
    </SafeAreaView>
  );
}
