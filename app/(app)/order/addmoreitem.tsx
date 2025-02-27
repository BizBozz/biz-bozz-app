import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/types";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { fetchDishes, Dish } from "../../../utils/menu/fetchDish";
import { addNewOrderItem } from "@/redux/orderSlice";
import LoadingSpinner from "@/components/LoadingSpinner";

interface MenuItem extends Dish {
  categoryName: string;
}

export default function AddMoreItem() {
  const { id } = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const dispatch = useDispatch();

  const currentOrder = useSelector(
    (state: RootState) => state.order.currentOrder
  );

  console.log(currentOrder);

  const getQuantity = (menu: MenuItem) => {
    if (!currentOrder) return 0;
    const item = currentOrder.orders.find(
      (item) => item.dishName === menu.dishName
    );
    return item?.quantity || 0;
  };

  const handleIncrement = (item: MenuItem) => {
    if (!currentOrder) {
      router.back();
      return;
    }

    dispatch(
      addNewOrderItem({
        dishName: item.dishName,
        price: item.price,
        quantity: 1,
      })
    );
  };

  const handleDecrement = (item: MenuItem) => {
    if (!currentOrder) {
      router.back();
      return;
    }

    const quantity = getQuantity(item);
    if (quantity <= 0) return;

    dispatch(
      addNewOrderItem({
        dishName: item.name,
        price: item.price,
        quantity: -1,
      })
    );
  };

  const getAllCategories = async () => {
    try {
      const dishes = await fetchDishes();
      if (dishes) {
        setLoading(false);
        const categoryArray = [
          ...new Set(dishes.map((item: MenuItem) => item.categoryName)),
        ];
        setCategories(categoryArray);
        setMenuItems(dishes);
        setSelectedCategory(categoryArray[0] || null);
      }
    } catch (error) {
      console.error("Failed to fetch dishes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = selectedCategory
      ? menuItems.filter((item) => item.categoryName === selectedCategory)
      : menuItems;
    setFilteredItems(filtered[0]?.items || []);
  }, [selectedCategory, menuItems]);

  console.log(filteredItems);

  useEffect(() => {
    if (!currentOrder) {
      router.back();
      return;
    }
    getAllCategories();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading menu items..." />;
  }

  return (
    <SafeAreaView className="relative h-screen w-screen bg-white relative">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold">Add Items</Text>
            <Text className="text-xl text-gray-400 font-bold ms-5">
              (Table {currentOrder?.table})
            </Text>
          </View>
          <Pressable
            className="bg-primary px-4 py-2 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Done</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-5"
        >
          <View className="flex-row gap-4">
            {categories.map((category, index) => (
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
    </SafeAreaView>
  );
}
