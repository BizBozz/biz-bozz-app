import { View, Text, Pressable } from "react-native";
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

  const hasOrders = (table: string) => {
    return receipts[table] && receipts[table].items.length > 0;
  };

  const handleTableSelect = (table: string) => {
    dispatch(selectTable(table));
    router.push("/(app)/order");
  };

  // console.log(selectedTable);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View>
        <Text className="text-4xl font-bold">Tables</Text>
      </View>
      <View className="mt-8 flex-row flex-wrap gap-4">
        {tables.map((table) => (
          <View key={table} className="">
            <Pressable
              className={`border border-primary px-6 py-4 rounded-lg font-bold ${
                selectedTable === table ? "bg-orange-700" : ""
              } ${hasOrders(table.toString()) ? "bg-primary" : ""}`}
              onPress={() => handleTableSelect(table.toString())}
            >
              <Text
                className={`text-2xl ${
                  selectedTable === table || hasOrders(table.toString())
                    ? "text-white"
                    : "text-primary"
                }`}
              >
                Table {table}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
