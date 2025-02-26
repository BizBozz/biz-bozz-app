import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface Order {
  id: number;
  time: string;
  totalPrice: string;
}

export default function OrdersManagement() {
  const [selectedDate, setSelectedDate] = useState("24/02/25");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDateRangeModalVisible, setDateRangeModalVisible] = useState(false);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setStartDatePickerVisible(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    setEndDatePickerVisible(false);
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      setSelectedDate(`${formatDate(startDate)} - ${formatDate(endDate)}`);
      setDateRangeModalVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-2">
        <Text className="text-3xl font-semibold">Orders Management</Text>
        <View className="flex-row items-center mt-5">
          <TouchableOpacity 
            className="flex-row items-center bg-orange-50 rounded-lg px-4 py-3"
            onPress={() => setDateRangeModalVisible(true)}
          >
            <Text className="text-orange-500 text-lg mr-2">{selectedDate}</Text>
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

      {/* Date Range Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDateRangeModalVisible}
        onRequestClose={() => setDateRangeModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-xl p-4">
            <Text className="text-xl font-semibold mb-4">Select Date Range</Text>
            
            {/* Start Date */}
            <TouchableOpacity
              className="flex-row items-center justify-between border border-gray-300 rounded-lg p-4 mb-3"
              onPress={() => setStartDatePickerVisible(true)}
            >
              <Text className="text-gray-600">Start Date</Text>
              <Text className="text-gray-800">
                {startDate ? formatDate(startDate) : 'Select'}
              </Text>
            </TouchableOpacity>

            {/* End Date */}
            <TouchableOpacity
              className="flex-row items-center justify-between border border-gray-300 rounded-lg p-4 mb-6"
              onPress={() => setEndDatePickerVisible(true)}
            >
              <Text className="text-gray-600">End Date</Text>
              <Text className="text-gray-800">
                {endDate ? formatDate(endDate) : 'Select'}
              </Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-gray-100"
                onPress={() => setDateRangeModalVisible(false)}
              >
                <Text className="text-gray-600">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-orange-500"
                onPress={handleApplyDateRange}
              >
                <Text className="text-white">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisible(false)}
        minimumDate={startDate || undefined}
      />
    </SafeAreaView>
  );
}
