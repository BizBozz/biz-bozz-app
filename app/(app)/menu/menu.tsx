import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import getCategory from "@/utils/menumanegement/getCategory";
import deleteCategory from "@/utils/menumanegement/deleteCategory";
import deleteMenuItem from "@/utils/menumanegement/deleteMenuItem";
import { MenuItem, MenuResponse } from "@/types/menu";
import getItems from "@/utils/menu";
import CreateCategoryModal from "@/app/(app)/menu/CreateCategoryModal";
import CreateMenuItemModal from "@/app/(app)/menu/CreateMenuItemModal";
import UpdateMenuItemModal from "@/app/(app)/menu/UpdateMenuItemModal";
import AlertModal from "@/app/components/AlertModal";

export default function MenuManagement() {
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isCreateCategoryModalVisible, setIsCreateCategoryModalVisible] =
    useState(false);
  const [isCreateMenuItemModalVisible, setIsCreateMenuItemModalVisible] =
    useState(false);
  const [isUpdateMenuItemModalVisible, setIsUpdateMenuItemModalVisible] =
    useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<
    MenuItem | undefined
  >();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: {
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress: () => void;
    }[];
  }>({
    visible: false,
    title: "",
    message: "",
  });

  const getAllCategory = async () => {
    const res = await getCategory();
    if (res.code === 200 && res.data.categories.length > 0) {
      setCategories(res.data.categories[0].categories);
      setId(res.data?.categories[0]?._id);
      setSelectedCategory(res.data.categories[0].categories[0]);
    }
  };

  console.log(selectedCategory);

  const getAllMenu = async () => {
    try {
      const res = (await getItems()) as MenuResponse;
      if (res.code === 200) {
        setLoading(false);
        setMenuItems(res.data);
      }
    } catch (error) {
      // console.log(error);
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

  const handleDeleteCategory = async (category: string) => {
    // console.log(category);
    setAlertConfig({
      visible: true,
      title: "Delete Category",
      message: `Are you sure you want to delete "${category}"?`,
      buttons: [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setAlertConfig({ ...alertConfig, visible: false });
            try {
              const response = await deleteCategory({ id, category });
              // console.log(response);
              if (response.code === 200) {
                await getAllCategory();
              } else {
                setAlertConfig({
                  visible: true,
                  title: "Error",
                  message: response.message || "Failed to delete category",
                  buttons: [
                    {
                      text: "OK",
                      onPress: () =>
                        setAlertConfig({ ...alertConfig, visible: false }),
                    },
                  ],
                });
              }
            } catch (error) {
              // console.error("Failed to delete category", error);
              setAlertConfig({
                visible: true,
                title: "Error",
                message: "Failed to delete category",
                buttons: [
                  {
                    text: "OK",
                    onPress: () =>
                      setAlertConfig({ ...alertConfig, visible: false }),
                  },
                ],
              });
            }
          },
        },
      ],
    });
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    setAlertConfig({
      visible: true,
      title: "Delete Menu Item",
      message: `Are you sure you want to delete "${item.dishName}"?`,
      buttons: [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setAlertConfig({ ...alertConfig, visible: false });
            try {
              const response = await deleteMenuItem(item._id);
              if (response.code === 200) {
                await getAllMenu();
              } else {
                setAlertConfig({
                  visible: true,
                  title: "Error",
                  message: response.message || "Failed to delete menu item",
                  buttons: [
                    {
                      text: "OK",
                      onPress: () =>
                        setAlertConfig({ ...alertConfig, visible: false }),
                    },
                  ],
                });
              }
            } catch (error) {
              // console.error("Failed to delete menu item:", error);
              setAlertConfig({
                visible: true,
                title: "Error",
                message: "Failed to delete menu item",
                buttons: [
                  {
                    text: "OK",
                    onPress: () =>
                      setAlertConfig({ ...alertConfig, visible: false }),
                  },
                ],
              });
            }
          },
        },
      ],
    });
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setIsUpdateMenuItemModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <View>
        <Text className="text-2xl font-bold">Menu Management</Text>
      </View>

      {/* Categories */}

      <View className="flex-row items-center gap-3 mt-6">
        <TouchableOpacity onPress={() => setIsCreateCategoryModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FF6B00" />
        </TouchableOpacity>
        {categories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {categories.map((category, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedCategory(category)}
                  onLongPress={() => handleDeleteCategory(category)}
                  delayLongPress={500}
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
                </Pressable>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Add Menu Button */}
      <TouchableOpacity
        className="bg-primary py-4 rounded-xl mt-6"
        onPress={() => setIsCreateMenuItemModalVisible(true)}
      >
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
              <TouchableOpacity
                className="p-2 bg-red-100 rounded-lg"
                onPress={() => handleDeleteMenuItem(item)}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                className="p-2 bg-orange-100 rounded-lg"
                onPress={() => handleEditMenuItem(item)}
              >
                <Ionicons name="pencil-outline" size={20} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Create Category Modal */}
      <CreateCategoryModal
        id={id}
        isVisible={isCreateCategoryModalVisible}
        onClose={() => setIsCreateCategoryModalVisible(false)}
        onSuccess={getAllCategory}
      />

      {/* Create Menu Item Modal */}
      <CreateMenuItemModal
        isVisible={isCreateMenuItemModalVisible}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onClose={() => setIsCreateMenuItemModalVisible(false)}
        onSuccess={() => {
          getAllMenu();
          setIsCreateMenuItemModalVisible(false);
        }}
        categories={categories}
        menuId={id}
      />

      {/* Update Menu Item Modal */}
      <UpdateMenuItemModal
        isVisible={isUpdateMenuItemModalVisible}
        onClose={() => {
          setIsUpdateMenuItemModalVisible(false);
          setSelectedMenuItem(undefined);
        }}
        onSuccess={() => {
          getAllMenu();
          setIsUpdateMenuItemModalVisible(false);
          setSelectedMenuItem(undefined);
        }}
        menuItem={selectedMenuItem}
      />

      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
      />
    </SafeAreaView>
  );
}
