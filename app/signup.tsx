import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { handleSignUp } from "@/utils/auth";
import AlertModal from "./components/AlertModal";
import Welcome from "@/components/Welcom";

export default function SignupScreen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    shopType: "",
  });

  const shopTypes = [
    "Retail Store",
    "Restaurant",
    "Grocery Store",
    "Fashion & Clothing",
    "Electronics Store",
    "Pharmacy",
    "Other",
  ];

  const handleNext = () => {
    if (step === 1) {
      if (
        !formData.phone_number ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        // Show error
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      setStep(2);
    }
  };

  const CreateAccount = async () => {
    const response = await handleSignUp(formData);
    console.log(response);
    if (response?.data?.statusCode === 201) {
      setShowSuccessModal(true);
    } else {
      setAlertVisible(true);
      setAlertMessage(response?.data?.message || response?.message);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  if (step === 2) {
    return (
      <View className="px-4 pt-[100px]">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={28} color="#000" />
          <Text className="ms-5 text-[30px] font-bold">Create Your Shop</Text>
        </TouchableOpacity>

        <View className="mb-4">
          <Text className="text-xl font-bold mb-4">Shop Name</Text>
          <TextInput
            className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
            placeholder="Enter your Shop Name"
            value={formData.shopName}
            onChangeText={(text) =>
              setFormData({ ...formData, shopName: text })
            }
          />
        </View>

        <View className="mb-10">
          <Text className="text-xl font-bold mb-4">Shop Type</Text>
          <TouchableOpacity
            className="w-full py-4 text-xl px-3 border border-gray-300 rounded-md justify-center"
            onPress={() => setShowTypeDropdown(true)}
          >
            <Text
              className={
                formData.shopType
                  ? "text-black text-xl"
                  : "text-gray-400 text-xl"
              }
            >
              {formData.shopType || "Select Your Shop Type"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showTypeDropdown}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTypeDropdown(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-center">
                  Select Shop Type
                </Text>
              </View>
              <ScrollView className="max-h-[400px]">
                {shopTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    className="p-4 border-b border-gray-100"
                    onPress={() => {
                      setFormData({ ...formData, shopType: type });
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text className="text-lg">{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                className="p-4 border-t border-gray-200"
                onPress={() => setShowTypeDropdown(false)}
              >
                <Text className="text-center text-orange-500 font-semibold text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          className="h-[50px] bg-orange-500 rounded-md items-center justify-center mt-auto mb-6"
          onPress={() => {
            CreateAccount();
          }}
        >
          <Text className="text-white font-semibold text-xl">Get Started</Text>
        </TouchableOpacity>

        <Welcome
          isVisible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        />

        <AlertModal
          visible={alertVisible}
          title="Error"
          message={alertMessage}
          buttons={[{ text: "OK", onPress: () => setAlertVisible(false) }]}
        />
      </View>
    );
  }

  return (
    <View className="px-4 pt-[100px]">
      <View className="flex-row items-center mb-8">
        <Text className="text-[30px] font-bold">Create Account</Text>
      </View>

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-xl font-bold mb-4">Phone Number</Text>
        <TextInput
          className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
          placeholder="Enter your phone number"
          value={formData.phone_number}
          onChangeText={(text) =>
            setFormData({ ...formData, phone_number: text })
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="mb-4">
        <Text className="text-xl font-bold mb-4">Password</Text>
        <View className="relative">
          <TextInput
            className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/*Confirm Password Input */}
      <View className="mb-10">
        <Text className="text-xl font-bold mb-4">Confirm Password</Text>
        <View className="relative">
          <TextInput
            className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
            placeholder="Please confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {formData.password !== formData.confirmPassword && (
          <Text className="text-red-600 text-sm text-end">
            Your password does not match
          </Text>
        )}
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        className="h-[50px] bg-orange-500 rounded-md items-center justify-center mb-6"
        onPress={handleNext}
      >
        <Text className="text-white font-semibold text-2xl">Next</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <View className="flex-row  justify-center items-center">
        <Text className="text-gray-600 text-xl">Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text className="text-orange-500 font-semibold text-xl">Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
