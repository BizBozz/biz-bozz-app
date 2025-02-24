import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
// import axios from "axios";
import getItems from "@/utils/menu";
import { MenuItem, MenuResponse } from "@/types/menu";
import {
  addItemToReceipt,
  decrementQuantity,
  incrementQuantity,
} from "@/redux/receiptSlice";

export default function OrderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categorys, setCategorys] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  // const [selectMenu, setSelectMenu] = useState<MenuItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const selectedTable = useSelector(
    (state: RootState) => state.receipts.selectedTable
  );
  const receipts = useSelector((state: RootState) => state.receipts.receipts);

  const getQuantity = (menu: MenuItem) => {
    if (!selectedTable || !receipts[selectedTable]) return 0;
    const items = receipts[selectedTable].items;
    const item = items.find((item) => item.dishName === menu.dishName);
    return item?.quantity || 0;
  };

  const handleIncrement = (item: MenuItem) => {
    if (!selectedTable) {
      alert("Please select a table first.");
      return;
    }

    const quantity = getQuantity(item);
    if (quantity === 0) {
      dispatch(addItemToReceipt({ table: selectedTable, item }));
    } else {
      dispatch(
        incrementQuantity({ table: selectedTable, itemName: item.dishName })
      );
    }
  };

  const handleDecrement = (item: MenuItem) => {
    if (!selectedTable) {
      alert("Please select a table first.");
      return;
    }
    dispatch(
      decrementQuantity({ table: selectedTable, itemName: item.dishName })
    );
  };

  const getAllCategory = async () => {
    try {
      const res = (await getItems()) as MenuResponse;
      if (res.code === 200) {
        setLoading(false);
        const categoryArray = [
          ...new Set(res.data.map((item: MenuItem) => item.categoryName)),
        ];
        setCategorys(categoryArray);
        setMenuItems(res.data);
        setSelectedCategory(categoryArray[0] || null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = selectedCategory
      ? menuItems.filter((item) => item.categoryName === selectedCategory)
      : menuItems;
    setFilteredItems(filtered[0]?.items || []);
  }, [selectedCategory, menuItems]);

  useEffect(() => {
    getAllCategory();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <View className="p-4 pb-24">
        <View className="flex-row items-center">
          <Text className="text-3xl font-bold">Menu</Text>
          <Text className="text-xl text-gray-400 font-bold ms-5">
            ( Ordering for Table {selectedTable})
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
        >
          <View className="flex-row gap-4">
            {categorys.map((category, index) => (
              <Pressable
                key={index}
                onPressIn={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-prilight"
                    : "bg-white border border-gray-200"
                } flex items-center justify-center font-bold px-4 py-2 rounded-3xl active:opacity-80`}
              >
                <Text
                  className={`font-bold ${
                    selectedCategory === category
                      ? "text-primary"
                      : "text-black"
                  }`}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {filteredItems.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="mt-5"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            <View className="mt-4">
              {filteredItems.map((item) => (
                <View
                  key={item._id}
                  className="flex-row mb-4 justify-between items-center bg-white px-4 py-5 rounded-xl border border-gray-300"
                >
                  <View className="flex-1">
                    <Text className="text-lg font-bold">{item.dishName}</Text>
                    <Text className="text-gray-500 mt-1">{item.price} MMK</Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    {getQuantity(item) > 0 && (
                      <Pressable
                        className="w-8 h-8 rounded-full bg-primary items-center justify-center active:opacity-80"
                        onPressIn={() => handleDecrement(item)}
                      >
                        <Text className="text-white text-xl">-</Text>
                      </Pressable>
                    )}
                    <Text className="text-lg font-semibold">
                      {getQuantity(item)}
                    </Text>
                    <Pressable
                      className="w-8 h-8 rounded-full bg-primary items-center justify-center active:opacity-80"
                      onPressIn={() => handleIncrement(item)}
                    >
                      <Text className="text-white text-xl">+</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
        <Pressable
          className="bg-primary px-4 py-5 rounded-full active:opacity-80"
          onPressIn={() => router.push("/(app)/receipt")}
        >
          <Text className="text-white text-center font-bold text-lg">
            View Receipt
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
