import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "expo-router";
import { Calendar, DateData } from "react-native-calendars";
import OrdersList from "../../../components/OrdersList";
import { formatDateForDisplay } from "../../../utils/dateFormatter";
import { deleteOrders } from "../../../utils/ordermanagement/deleteOrders";
import AlertModal from "@/app/components/AlertModal";
import LoadingSpinner from "@/components/LoadingSpinner";

interface MarkedDates {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

interface AlertConfig {
  visible: boolean;
  title: string;
  message: string;
  buttons?: {
    text: string;
    style?: "default" | "cancel" | "destructive";
    onPress: () => void;
  }[];
}

export default function Orders() {
  const today = new Date().toISOString().split("T")[0];
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(today);
  const [endDate, setEndDate] = useState<string | null>(today);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    title: "",
    message: "",
    buttons: [],
  });
  const ordersListRef = useRef<any>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({
    [today]: {
      startingDay: true,
      endingDay: true,
      color: "#FF6F00",
      textColor: "white",
    },
  });
  const [displayDateRange, setDisplayDateRange] = useState(
    formatDateForDisplay(today)
  );
  // const navigation = useNavigation();
  const pathname = usePathname();
  console.log(pathname);
  const [isLoading, setIsLoading] = useState(false);

  const onDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      // Start new range
      const newMarkedDates: MarkedDates = {
        [day.dateString]: {
          startingDay: true,
          color: "#FF6F00",
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
          color: "#FF6F00",
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

      setMarkedDates(newMarkedDates);

      // Update display date range with formatted dates
      setStartDate(start);
      setEndDate(end);
      if (start === end) {
        setDisplayDateRange(formatDateForDisplay(start));
      } else {
        setDisplayDateRange(
          `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`
        );
      }
    }
  };

  const handleApply = () => {
    if (startDate && !endDate) {
      // If only start date is selected, set end date to the same date
      const newMarkedDates: MarkedDates = {
        [startDate]: {
          startingDay: true,
          endingDay: true,
          color: "#FF6F00",
          textColor: "white",
        },
      };
      setEndDate(startDate);
      setMarkedDates(newMarkedDates);
      setDisplayDateRange(formatDateForDisplay(startDate));
    }
    setCalendarVisible(false);
  };

  const handleDeleteSuccess = () => {
    // Reset selection state after successful deletion
    setSelectAll(false);
    setSelectedOrders(new Set());
    setShouldRefetch(true);
  };

  const hideAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const showSuccessAlert = (message: string) => {
    setAlertConfig({
      visible: true,
      title: "Success",
      message,
      buttons: [],
    });

    // Auto close after 1 second
    setTimeout(hideAlert, 1000);
  };

  const showErrorAlert = (message: string) => {
    setAlertConfig({
      visible: true,
      title: "Error",
      message,
      buttons: [{ text: "OK", onPress: hideAlert, style: "destructive" }],
    });
  };

  const handleDelete = async () => {
    if (selectedOrders.size === 0) {
      setAlertConfig({
        visible: true,
        title: "No Orders Selected",
        message: "Please select orders to delete.",
        buttons: [{ text: "OK", onPress: hideAlert, style: "default" }],
      });
      return;
    }

    setAlertConfig({
      visible: true,
      title: "Confirm Delete",
      message: `Are you sure you want to delete ${selectedOrders.size} selected order(s)?`,
      buttons: [
        {
          text: "Cancel",
          onPress: hideAlert,
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: confirmDelete,
          style: "destructive",
        },
      ],
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteOrders(Array.from(selectedOrders));
      handleDeleteSuccess();
      hideAlert();
      showSuccessAlert("Orders deleted successfully!");
    } catch (error) {
      console.error("Error deleting orders:", error);
      showErrorAlert("Failed to delete orders. Please try again.");
    }
  };

  useEffect(() => {
    if (pathname.includes("/order")) {
      console.log("yes");
      setShouldRefetch(true);
    }
  }, [pathname]);

  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white pt-2">
      {/* Header */}
      <View className="px-4 py-2">
        <Text className="text-3xl font-semibold">Orders Management</Text>
        <View className="flex-row items-center mt-5">
          <TouchableOpacity
            className="flex-row items-center bg-orange-50 rounded-lg px-4 py-3"
            onPress={() => setCalendarVisible(true)}
          >
            <Text className="text-orange-500 text-xl mr-3">
              {displayDateRange}
            </Text>
            <Ionicons name="calendar-outline" size={25} color="#FF6F00" />
          </TouchableOpacity>
          <TouchableOpacity
            className="ml-5 bg-red-500 rounded-lg px-4 py-3"
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Header */}
      <View className="flex-row items-center px-4 py-5 bg-orange-500 mx-4 mt-3">
        <TouchableOpacity
          style={{ width: "10%" }}
          onPress={() => setSelectAll(!selectAll)}
        >
          <View
            className={`h-5 w-5 border-2 rounded flex items-center justify-center ${
              selectAll ? "bg-white border-white" : "border-white"
            }`}
          >
            {selectAll && <Text className="text-orange-500 text-xs">✓</Text>}
          </View>
        </TouchableOpacity>
        <Text
          className="text-xl text-white font-medium"
          style={{ width: "10%" }}
        >
          No
        </Text>
        <Text
          className="text-xl text-center text-white font-medium"
          style={{ width: "50%" }}
        >
          Order Time
        </Text>
        <Text
          className="text-xl text-center text-white font-medium"
          style={{ width: "30%" }}
        >
          Total
        </Text>
      </View>

      {/* Orders List Component */}
      <OrdersList
        ref={ordersListRef}
        startDate={startDate}
        endDate={endDate}
        selectAll={selectAll}
        onSelectAll={setSelectAll}
        onSelectedOrdersChange={setSelectedOrders}
        onDeleteSuccess={handleDeleteSuccess}
        shouldRefetch={shouldRefetch}
        onRefetchComplete={() => setShouldRefetch(false)}
      />

      {/* Alert Modal */}
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
      />

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
                selectedDayBackgroundColor: "#FF6F00",
                selectedDayTextColor: "white",
              }}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-end mt-5">
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
                <Text className="text-gray-600 text-lg font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="bg-primary px-6 py-3 rounded-lg"
              >
                <Text className="text-white text-lg font-bold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
