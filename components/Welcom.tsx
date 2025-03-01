import React from "react";
import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

// Import the welcome image
import welcome from "../assets/images/welcome.svg";

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function Welcome({
  isVisible,
  onClose,
  title = "Account Created!",
  description = "Your account has been successfully created.",
}: SuccessModalProps) {
  const scale = useSharedValue(1);

  // Create a bouncing animation for the image
  React.useEffect(() => {
    if (isVisible) {
      scale.value = withRepeat(
        withSequence(withSpring(0.5), withSpring(1.1)),
        2,
        true
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white m-4 p-6 rounded-2xl items-center w-80">
          {/* Animated Welcome Image */}
          <Animated.Image
            source={welcome}
            style={[{ width: 200, height: 200 }, animatedStyle]}
            resizeMode="contain"
          />

          {/* Success Text */}
          <Text className="text-2xl font-bold mb-2 text-center">{title}</Text>
          <Text className="text-gray-600 text-center mb-6">{description}</Text>

          {/* OK Button */}
          <TouchableOpacity
            className="bg-[#FF6B00] w-full py-4 rounded-full"
            onPress={onClose}
          >
            <Text className="text-white text-center font-bold text-lg">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
