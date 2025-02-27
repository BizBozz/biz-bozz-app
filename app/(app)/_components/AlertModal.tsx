import { View, Text, Modal, TouchableOpacity } from "react-native";

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "error" | "warning";
}

const AlertModal = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "warning",
}: AlertModalProps) => {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      default:
        return "bg-orange-500";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden">
          <View className={`px-6 py-4 ${getBackgroundColor()}`}>
            <Text className="text-xl font-bold text-white">{title}</Text>
          </View>
          <View className="p-6">
            <Text className="text-gray-600 text-lg">{message}</Text>
          </View>
          <View className="flex-row justify-end border-t border-gray-200 p-4">
            {onCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className="px-4 py-2 rounded-lg mr-2"
              >
                <Text className="text-gray-600 text-lg font-semibold">
                  {cancelText}
                </Text>
              </TouchableOpacity>
            )}
            {onConfirm && (
              <TouchableOpacity
                onPress={onConfirm}
                className={`px-6 py-2 rounded-lg ${getBackgroundColor()}`}
              >
                <Text className="text-white text-lg font-semibold">
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
