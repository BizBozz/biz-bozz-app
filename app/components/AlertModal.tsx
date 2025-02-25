import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress: () => void;
  }[];
}

export default function AlertModal({
  visible,
  title,
  message,
  buttons = [{ text: "OK", onPress: () => {}, style: "default" }],
}: AlertModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white w-full max-w-sm rounded-2xl px-6 py-[30px]">
          <Text className="text-2xl font-bold mb-4">{title}</Text>
          <Text className="text-gray-600 text-base mb-8">{message}</Text>
          <View className="flex-row justify-end gap-4">
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                className={`px-6 py-4 rounded-lg ${
                  button.style === "destructive"
                    ? "bg-primary"
                    : button.style === "cancel"
                    ? "border border-primary"
                    : "bg-primary"
                }`}
              >
                <Text
                  className={`text-xl ${
                    button.style === "cancel"
                      ? "text-primary"
                      : "text-white font-bold"
                  }`}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
