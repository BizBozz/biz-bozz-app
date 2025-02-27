import { View } from "react-native";
import { Stack } from "expo-router";
import CustomNavbar from "../../components/CustomNavbar";

export default function AppLayout() {
  return (
    <View className="flex-1">
      <CustomNavbar />

      <Stack
        screenOptions={{
          headerShown: false, // This hides the default header provided by the Stack Navigator
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="order" />
        <Stack.Screen name="receipt" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="orders" />
        <Stack.Screen name="order/[id]" />
      </Stack>
    </View>
  );
}
