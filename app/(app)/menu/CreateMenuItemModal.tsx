import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import AlertModal from "@/app/components/AlertModal";
import { Picker } from "@react-native-picker/picker";
import addMenuItem from "@/utils/menumanegement/addMenuItem";

interface CreateMenuItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categories: string[];
  menuId?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export default function CreateMenuItemModal({
  isVisible,
  onClose,
  onSuccess,
  categories,
  selectedCategory,
  onSelectCategory,
}: CreateMenuItemModalProps) {
  // console.log(selectedCategory);
  // console.log("onselect", selectedCategory);
  const [isLoading, setIsLoading] = useState(false);
  const [dishImage, setDishImage] = useState<string | null>(null);
  const [dishName, setDishName] = useState("");
  const [price, setPrice] = useState("");
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

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setDishImage(null);
      setDishName("");
      setPrice("");
    }
  };

  const handleAddDish = async () => {
    if (!dishName.trim()) {
      setAlertConfig({
        visible: true,
        title: "Invalid Input",
        message: "Please enter a dish name",
        buttons: [
          {
            text: "OK",
            onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
          },
        ],
      });
      return;
    }

    if (!selectedCategory) {
      setAlertConfig({
        visible: true,
        title: "Invalid Input",
        message: "Please select a category",
        buttons: [
          {
            text: "OK",
            onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
          },
        ],
      });
      return;
    }

    if (!price.trim()) {
      setAlertConfig({
        visible: true,
        title: "Invalid Input",
        message: "Please enter a price",
        buttons: [
          {
            text: "OK",
            onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
          },
        ],
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await addMenuItem({
        categoryName: selectedCategory,
        dishName: dishName.trim(),
        price: price.trim(),
      });

      if (response.code === 201) {
        onSuccess?.();
        handleClose();
      } else {
        setAlertConfig({
          visible: true,
          title: "Error",
          message: response.message || "Failed to add menu item",
          buttons: [
            {
              text: "OK",
              onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
            },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to add menu item:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to add menu item",
        buttons: [
          {
            text: "OK",
            onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal visible={isVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-2xl px-6 py-[40px]">
            <View className="mb-4">
              <Text className="text-[16px] font-medium mb-2">Category</Text>
              <View className="border border-gray-300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => onSelectCategory?.(itemValue)}
                  enabled={!isLoading}
                  style={{
                    backgroundColor: "transparent",
                    outline: "none",
                  }}
                >
                  <Picker.Item
                    label="Select Dish Category"
                    value=""
                    enabled={false}
                  />
                  {categories.map((category) => (
                    <Picker.Item
                      key={category}
                      label={category}
                      value={category}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-[16px] font-medium mb-2">Dish Name</Text>
              <TextInput
                className="w-full text-[16px] border border-gray-300 rounded-lg py-4 px-5"
                placeholder="Enter Your Dish Name"
                value={dishName}
                onChangeText={setDishName}
                editable={!isLoading}
              />
            </View>

            <View className="mb-8">
              <Text className="text-[16px] font-medium mb-2">Price</Text>
              <View className="flex-row border border-gray-300 rounded-lg px-4 py-1">
                <TextInput
                  className="flex-1 text-[16px]"
                  placeholder="Enter Your Price"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
                <View className="justify-center ml-2">
                  <Text className="text-[16px]">MMK</Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={handleClose}
                className="px-6 py-4 border border-primary rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-primary text-[16px]">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddDish}
                className={`bg-primary px-6 py-4 rounded-lg ${
                  !dishName.trim() || !selectedCategory || !price.trim()
                    ? "opacity-50"
                    : ""
                }`}
                disabled={
                  !dishName.trim() ||
                  !selectedCategory ||
                  !price.trim() ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-xl font-bold">Add Dish</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <AlertModal
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
      />
    </>
  );
}
