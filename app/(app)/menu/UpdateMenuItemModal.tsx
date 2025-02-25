import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AlertModal from "@/app/components/AlertModal";
import { MenuItem } from "@/types/menu";
import pushMenuItem from "@/utils/menumanegement/pushMenuItem";

interface UpdateMenuItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  menuItem?: MenuItem;
}

export default function UpdateMenuItemModal({
  isVisible,
  onClose,
  onSuccess,
  menuItem,
}: UpdateMenuItemModalProps) {
  console.log(menuItem);
  const [isLoading, setIsLoading] = useState(false);
  const [dishName, setDishName] = useState(menuItem?.dishName || "");
  const [price, setPrice] = useState(menuItem?.price?.toString() || "");
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

  // Reset form when menuItem changes
  React.useEffect(() => {
    if (menuItem) {
      setDishName(menuItem.dishName || "");
      setPrice(menuItem.price?.toString() || "");
    }
  }, [menuItem]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form
      if (menuItem) {
        setDishName(menuItem.dishName || "");
        setPrice(menuItem.price?.toString() || "");
      }
    }
  };

  const handleUpdateDish = async () => {
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
      const res = await pushMenuItem({
        id: menuItem?._id || "",
        dishName,
        price: parseFloat(price),
      });
      if (res.code === 200) {
        onSuccess?.();
        handleClose();
      }
      // TODO: Add update API call here
    } catch (error) {
      console.error("Failed to update menu item:", error);
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Failed to update menu item",
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
              <Text className="text-[16px] font-medium mb-2">Dish Name</Text>
              <TextInput
                className="w-full text-[16px] border border-gray-300 rounded-lg p-4"
                placeholder="Enter Your Dish Name"
                value={dishName}
                onChangeText={setDishName}
                editable={!isLoading}
              />
            </View>

            <View className="mb-8">
              <Text className="text-[16px] font-medium mb-2">Price</Text>
              <View className="flex-row border border-gray-300 rounded-lg px-3 py-1">
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
                onPress={handleUpdateDish}
                className={`bg-primary px-6 py-4 rounded-lg ${
                  !dishName.trim() || !price.trim() ? "opacity-50" : ""
                }`}
                disabled={!dishName.trim() || !price.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-[16px] font-bold">
                    Update
                  </Text>
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
