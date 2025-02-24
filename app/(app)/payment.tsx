import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from "react-native";
import { handlePayment } from "@/utils/order";
import { useRouter } from "expo-router";
import SuccessModal from "@/components/SuccessModal";

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  totalAmount: number;
  subTotal: number;
  taxRate: string;
  selectedTable: string;
  orderType: "Dine In" | "Take Away";
  items: Array<{ dishName: string; price: number; quantity: number }>;
}

export default function PaymentModal({
  isVisible,
  onClose,
  totalAmount,
  subTotal,
  taxRate,
  selectedTable,
  orderType,
  items,
}: PaymentModalProps) {
  const router = useRouter();
  const [paidPrice, setPaidPrice] = useState(totalAmount.toString());
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reset paid price when modal opens with new total amount
  useEffect(() => {
    setPaidPrice(totalAmount.toString());
  }, [totalAmount]);

  // Convert strings to numbers for calculation
  const extraChange = Number(paidPrice) - totalAmount;

  const handleConfirm = async () => {
    try {
      const paymentData = {
        table: selectedTable,
        tax: Number(taxRate) / 100,
        orderType,
        paymentType: "Cash" as const,
        orders: items,
        totalPrice: subTotal,
        finalPrice: totalAmount,
        paidPrice: Number(paidPrice),
        extraChange,
      };

      const result = await handlePayment(paymentData);
      
      if (result.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process payment");
      console.error(error);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    router.push("/(app)/home");
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-center">
          <View className="bg-white mx-4 rounded-2xl">
            <View className="p-6">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold">Calculator</Text>
                <TouchableOpacity onPress={onClose}>
                  <Text className="text-gray-500 text-lg">✕</Text>
                </TouchableOpacity>
              </View>

              {/* Calculator content */}
              <View className="space-y-4 mb-6">
                {/* Total Price */}
                <View className="flex-row justify-between items-center p-3">
                  <Text className="text-base text-gray-600">Total Price</Text>
                  <View className="flex-row items-center">
                    <Text className="px-3 py-2">
                      {totalAmount.toLocaleString()}
                    </Text>
                    <Text>MMK</Text>
                  </View>
                </View>

                {/* Paid Price Input */}
                <View className="flex-row justify-between items-center border border-gray-300 rounded-md p-3">
                  <Text className="text-base text-gray-600">Paid Price</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      keyboardType="numeric"
                      value={paidPrice}
                      onChangeText={(text) => setPaidPrice(text)}
                      className="px-3 py-2 text-right"
                    />
                    <Text>MMK</Text>
                  </View>
                </View>

                {/* Extra Change */}
                <View className="flex-row justify-between items-center p-3">
                  <Text className="text-base text-gray-600">Extra Change</Text>
                  <Text className="text-base font-bold">
                    {extraChange.toLocaleString()} MMK
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  className="flex-1 py-3 border border-gray-300 rounded-md"
                  onPress={onClose}
                >
                  <Text className="text-center text-base">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 py-3 bg-[#ff6b00] rounded-md"
                  onPress={handleConfirm}
                >
                  <Text className="text-white text-center text-base">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal 
        isVisible={showSuccessModal}
        onClose={handleSuccessClose}
      />
    </>
  );
}
