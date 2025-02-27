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
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

export default function Orders() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
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
    if (!startDate || (startDate && endDate)) {
      // Start new range
      const newMarkedDates: MarkedDates = {
        [day.dateString]: {
          startingDay: true,
          color: "#2196F3",
          textColor: "white",
        },
      };
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates(newMarkedDates);
    } else {
      // Complete the range
      const newEndDate = day.dateString;
      const newMarkedDates: MarkedDates = {};

      // Ensure end date is after start date
      const start = startDate < newEndDate ? startDate : newEndDate;
      const end = startDate < newEndDate ? newEndDate : startDate;

      // Create date range
      let currentDate = new Date(start);
      const endDateObj = new Date(end);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split("T")[0];
        newMarkedDates[dateString] = {
          color: "#2196F3",
          textColor: "white",
        };

        if (dateString === start) {
          newMarkedDates[dateString].startingDay = true;
        }
        if (dateString === end) {
          newMarkedDates[dateString].endingDay = true;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      setStartDate(start);
      setEndDate(end);
      setMarkedDates(newMarkedDates);

      // Update display date range
      const formattedStartDate = new Date(start).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      const formattedEndDate = new Date(end).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      setDisplayDateRange(`${formattedStartDate} - ${formattedEndDate}`);
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
              Select Date Range
            </Text>

            <Calendar
              onDayPress={onDayPress}
              markedDates={markedDates}
              markingType="period"
              theme={{
                todayTextColor: "#FF6F00",
                arrowColor: "#FF6F00",
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14,
              }}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                onPress={() => {
                  setCalendarVisible(false);
                  if (!endDate) {
                    setStartDate(null);
                    setMarkedDates({});
                    setDisplayDateRange("");
                  }
                }}
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
