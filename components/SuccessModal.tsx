import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isVisible, onClose }: SuccessModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white m-4 p-6 rounded-2xl items-center w-80">
          {/* Success Icon */}
          <View className="w-20 h-20 bg-[#FF6B00]/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark-circle" size={50} color="#FF6B00" />
          </View>

          {/* Success Text */}
          <Text className="text-2xl font-bold mb-2">Payment Successful!</Text>
          <Text className="text-gray-600 text-center mb-6">
            Your order has been confirmed.
          </Text>

          {/* OK Button */}
          <TouchableOpacity
            className="bg-[#FF6B00] w-full py-4 rounded-full"
            onPress={onClose}
          >
            <Text className="text-white text-center font-bold text-lg">
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
