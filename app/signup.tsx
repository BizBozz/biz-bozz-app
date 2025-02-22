import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignupScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  return (
    <View className="flex-1 bg-white px-4 pt-[100px]">
      <View className="flex-row items-center mb-8">
        {/* <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity> */}
        <Text className="text-[30px] font-bold">Create Account</Text>
      </View>

      {/* Name Input */}
      {/* <View className="mb-4">
        <Text className="text-xl mb-1">Full Name</Text>
        <TextInput
          className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </View> */}

      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-xl font-bold mb-4">Email Address</Text>
        <TextInput
          className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone Input */}
      <View className="mb-4">
        <Text className="text-xl font-bold mb-4">Phone Number</Text>
        <TextInput
          className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />
      </View>

      {/* Password Input */}
      <View className="mb-10">
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

      {/* Sign Up Button */}
      <TouchableOpacity className="h-[50px] bg-orange-500 rounded-md items-center justify-center mb-6">
        <Text className="text-white font-semibold text-2xl">
          Create Account
        </Text>
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
