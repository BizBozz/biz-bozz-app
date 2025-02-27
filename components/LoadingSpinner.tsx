import { View, Text, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  fullscreen?: boolean;
  message?: string;
}

export default function LoadingSpinner({ 
  fullscreen = true, 
  message = "Loading..." 
}: LoadingSpinnerProps) {
  if (fullscreen) {
    return (
      <View className="flex-1 justify-center items-center bg-white/80 absolute inset-0 z-50">
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text className="text-gray-600 mt-4 font-medium">{message}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center py-4 space-x-2">
      <ActivityIndicator size="small" color="#FF6B00" />
      <Text className="text-gray-600 font-medium">{message}</Text>
    </View>
  );
}
