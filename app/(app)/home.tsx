import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { selectTable } from "@/redux/receiptSlice";
import { router } from "expo-router";

export default function HomeScreen() {
  const tables = [1, 2, 3, 4, 5, 6];
  const dispatch = useDispatch();
  const selectedTable = useSelector(
    (state: RootState) => state.receipts.selectedTable
  );
  const receipts = useSelector((state: RootState) => state.receipts.receipts);

  const handleTableSelect = (table: number) => {
    dispatch(selectTable(table));
    router.push("/(app)/order");
  };

  console.log(selectedTable);

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View>
        <Text className="text-4xl font-bold">Tables</Text>
      </View>
      <View className="mt-8 flex-row flex-wrap gap-4">
        {tables.map((table) => (
          <View key={table} className="">
            <TouchableOpacity
              className="border border-gray-300 px-6 py-4 rounded-lg font-bold"
              onPress={() => handleTableSelect(table)}
            >
              <Text className="text-2xl">Table {table}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
