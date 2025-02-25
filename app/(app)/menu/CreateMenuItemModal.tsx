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

interface CreateMenuItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categories: string[];
}

export default function CreateMenuItemModal({
  isVisible,
  onClose,
  onSuccess,
  categories,
}: CreateMenuItemModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dishImage, setDishImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
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
      setSelectedCategory("");
      setDishName("");
      setPrice("");
    }
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    console.log("Image upload clicked");
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

    // TODO: Implement API call to add menu item
    try {
      setIsLoading(true);
      // Add API call here

      onSuccess?.();
      handleClose();
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
          <View className="bg-white w-full max-w-sm rounded-2xl px-6 py-[30px]">
            <View className="items-center mb-6">
              {/* <View className="w-32 h-32 bg-orange-500 rounded-lg items-center justify-center">
                {dishImage ? (
                  <Image
                    source={{ uri: dishImage }}
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <Image
                    source={require("@/assets/images/logo.png")}
                    className="w-16 h-16"
                  />
                )}
              </View> */}
              <View className="mt-4">
                <TouchableOpacity
                  onPress={handleImageUpload}
                  className="bg-orange-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white">Upload Dish Image</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <View className="border border-gray-300 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  enabled={!isLoading}
                  style={{ backgroundColor: "transparent", height: 50 }}
                >
                  <Picker.Item label="Select Dish Category" value="" />
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

            <TextInput
              className="w-full border border-gray-300 rounded-lg p-4 mb-4"
              placeholder="Enter Your Dish Name"
              value={dishName}
              onChangeText={setDishName}
              editable={!isLoading}
            />

            <View className="flex-row mb-8">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg p-4"
                placeholder="Enter Your Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                editable={!isLoading}
              />
              <View className="justify-center ml-2">
                <Text className="text-lg">MMK</Text>
              </View>
            </View>

            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={handleClose}
                className="px-6 py-4 border border-primary rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-primary text-xl">Cancel</Text>
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
