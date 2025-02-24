import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import getCategory from "@/utils/menumanegement/getCategory";
import { MenuItem, MenuResponse } from "@/types/menu";
import getItems from "@/utils/menu";

export default function MenuManagement() {
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const getAllCategory = async () => {
    const res = await getCategory();
    setCategories(res.data.categories[0].categories);
    setSelectedCategory(res.data.categories[0].categories[0]);
  };

  const getAllMenu = async () => {
    try {
      const res = (await getItems()) as MenuResponse;
      if (res.code === 200) {
        setLoading(false);
        setMenuItems(res.data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllMenu();
  }, []);

  useEffect(() => {
    const filtered = selectedCategory
      ? menuItems.filter((item) => item.categoryName === selectedCategory)
      : menuItems;
    setFilteredItems(filtered[0]?.items || []);
  }, [selectedCategory, menuItems]);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View>
        <Text className="text-2xl font-bold">Menu Management</Text>
      </View>

      {/* Categories */}
      {categories.length > 0 && (
        <View className="flex-row items-center gap-3 mt-6">
          <TouchableOpacity>
            <Ionicons name="add" size={24} color="#FF6B00" />
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === category ? "bg-orange-100" : "bg-white"
                  }`}
                >
                  <Text
                    className={`${
                      selectedCategory === category
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Add Menu Button */}
      <TouchableOpacity className="bg-primary py-4 rounded-xl mt-6">
        <Text className="text-white text-center font-semibold">Add Menu</Text>
      </TouchableOpacity>

      {/* Menu Items */}
      <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
        {filteredItems.map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center bg-white py-4 border-b border-gray-200"
          >
            <View>
              <Text className="text-lg font-semibold">{item.dishName}</Text>
              <Text className="text-gray-500 mt-1">{item.price}</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity className="p-2 bg-red-100 rounded-lg">
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2 bg-orange-100 rounded-lg">
                <Ionicons name="pencil-outline" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
