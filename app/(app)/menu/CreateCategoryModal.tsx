import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import addCategory from "@/utils/menumanegement/addCategory";
import pushCategories from "@/utils/menumanegement/pushCategories";
import AlertModal from "@/app/components/AlertModal";

interface CreateCategoryModalProps {
  id: string;
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCategoryModal({
  id,
  isVisible,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
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
      setCategoryName("");
    }
  };

  const handleCreate = async () => {
    if (id !== "") {
      setIsLoading(true);
      const response = await pushCategories({
        id: id,
        categories: categoryName,
      });
      if (response.code === 200) {
        setIsLoading(false);
        onSuccess?.();
        onClose();
      } else {
        setIsLoading(false);
        setAlertConfig({
          visible: true,
          title: "Error",
          message: response.message || "Failed to add category",
          buttons: [
            {
              text: "OK",
              onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
            },
          ],
        });
      }
      return;
    } else if (id == "") {
      setIsLoading(true);
      const response = await addCategory(categoryName);
      if (response.code === 200) {
        setIsLoading(false);
        onSuccess?.();
        onClose();
      } else {
        setIsLoading(false);
        setAlertConfig({
          visible: true,
          title: "Error",
          message: response.message || "Failed to add category",
          buttons: [
            {
              text: "OK",
              onPress: () => setAlertConfig({ ...alertConfig, visible: false }),
            },
          ],
        });
      }
    }
  };

  return (
    <>
      <Modal visible={isVisible} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-2xl px-6 py-[30px]">
            <Text className="text-2xl font-bold mb-8">
              Create Menu Category
            </Text>
            <TextInput
              className="w-full border border-gray-300 rounded-lg p-4 mb-8"
              placeholder=""
              value={categoryName}
              onChangeText={(text) => setCategoryName(text)}
              editable={!isLoading}
            />
            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={handleClose}
                className="px-6 py-4 border border-primary rounded-lg"
                disabled={isLoading}
              >
                <Text className="text-primary text-xl">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                className={`bg-primary px-6 py-4 rounded-lg ${
                  categoryName == "" ? "opacity-50" : ""
                }`}
                disabled={!categoryName.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-xl font-bold">Create</Text>
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
