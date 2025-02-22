import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6 bg-gray-50 rounded-lg m-4">
        <Text className="text-4xl font-bold text-blue-600 mb-4">
          Welcome to Home
        </Text>
        <Text className="text-xl text-gray-600">Your Business Assistant</Text>
      </View>
    </SafeAreaView>
  );
}
