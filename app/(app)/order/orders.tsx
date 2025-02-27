import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Calendar, DateData } from "react-native-calendars";

interface Order {
  id: number;
  time: string;
  totalPrice: string;
}

interface MarkedDates {
  [date: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

export default function Orders() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [displayDateRange, setDisplayDateRange] = useState("");

  const [orders, setOrders] = useState<Order[]>([
    { id: 1, time: "3:43 PM", totalPrice: "26,250 MMK" },
    { id: 2, time: "3:43 PM", totalPrice: "26,250 MMK" },
    { id: 3, time: "3:44 PM", totalPrice: "10,500 MMK" },
    { id: 4, time: "3:44 PM", totalPrice: "10,500 MMK" },
    { id: 5, time: "3:47 PM", totalPrice: "26,250 MMK" },
    { id: 6, time: "9:32 PM", totalPrice: "26,250 MMK" },
    { id: 7, time: "9:40 PM", totalPrice: "47,250 MMK" },
    { id: 8, time: "9:43 PM", totalPrice: "31,500 MMK" },
  ]);

  const onDayPress = (day: DateData) => {
    const dateString = day.dateString;
    let newSelectedDates = [...selectedDates];
    let newMarkedDates = { ...markedDates };

    if (selectedDates.includes(dateString)) {
      // Remove date if already selected
      newSelectedDates = newSelectedDates.filter((date) => date !== dateString);
      delete newMarkedDates[dateString];
    } else {
      // Add new date
      newSelectedDates.push(dateString);
      newMarkedDates[dateString] = {
        selected: true,
        selectedColor: "#2196F3",
      };
    }

    setSelectedDates(newSelectedDates);
    setMarkedDates(newMarkedDates);

    // Update display date range
    if (newSelectedDates.length > 0) {
      const sortedDates = [...newSelectedDates].sort();
      const firstDate = new Date(sortedDates[0]).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      const lastDate = new Date(
        sortedDates[sortedDates.length - 1]
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      setDisplayDateRange(`${firstDate} - ${lastDate}`);
    } else {
      setDisplayDateRange("");
    }
  };

  const handleApply = () => {
    setCalendarVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-2">
        <Text className="text-3xl font-semibold">Orders Management</Text>
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            className="flex-row items-center bg-orange-50 rounded-lg px-4 py-3"
            onPress={() => setCalendarVisible(true)}
          >
            <Text className="text-orange-500 text-lg mr-2">
              {displayDateRange || "Select Dates"}
            </Text>
            <Ionicons name="calendar-outline" size={25} color="#FF6B00" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-5 bg-red-500 rounded-lg px-4 py-3">
            <Ionicons name="trash-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <View className="flex-row items-center px-4 py-3 bg-orange-500 mx-4">
        <View style={{ width: "10%" }}>
          <View className="h-5 w-5 border-2 border-white rounded" />
        </View>
        <Text className="text-white font-medium" style={{ width: "15%" }}>
          No
        </Text>
        <Text className="text-white font-medium" style={{ width: "35%" }}>
          Order Time
        </Text>
        <Text className="text-white font-medium" style={{ width: "40%" }}>
          Total Price
        </Text>
      </View>

      {/* Orders List */}
      <ScrollView className="flex-1">
        {orders.map((order) => (
          <View
            key={order.id}
            className="flex-row items-center px-4 py-4 border-b border-gray-200 mx-4"
          >
            <View style={{ width: "10%" }}>
              <View className="h-5 w-5 border border-gray-300 rounded" />
            </View>
            <Text className="text-gray-800" style={{ width: "15%" }}>
              {order.id}
            </Text>
            <Text className="text-gray-800" style={{ width: "35%" }}>
              {order.time}
            </Text>
            <Text className="text-gray-800" style={{ width: "40%" }}>
              {order.totalPrice}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-[90%]">
            <Text className="text-xl font-semibold mb-4">
              Select Multiple Dates
            </Text>

            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType="multi-dot"
              theme={{
                selectedDayBackgroundColor: "#2196F3",
                todayTextColor: "#2196F3",
                arrowColor: "#2196F3",
              }}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                onPress={() => setCalendarVisible(false)}
                className="px-4 py-2 mr-3"
              >
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
