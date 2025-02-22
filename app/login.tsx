import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { handleSignIn } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone_number || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    const res = await handleSignIn({ phone_number, password });
    if (res.statusCode === 200) {
      setLoading(false);
      router.push("/(app)/home");
      AsyncStorage.setItem("biz-bozz-token", res.data.token);
    }
    console.log(res);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-[100px]">
      <Text className="text-[30px] font-bold mb-10">Welcome Back</Text>

      {/* Email/Phone Input */}
      <View className="mb-5">
        <Text className="text-xl mb-4 font-bold">Phone Number</Text>
        <TextInput
          className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
          placeholder="Enter Phone Number"
          value={phone_number}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          // keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="mb-10">
        <Text className="text-xl mb-4 font-bold">Password</Text>
        <View className="relative">
          <TextInput
            className="w-full h-15 text-xl px-3 border border-gray-300 rounded-md"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
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

      {/* Forgot Password */}
      {/* <TouchableOpacity className="mb-6">
        <Text className="text-right text-orange-500">Forgot Password?</Text>
      </TouchableOpacity> */}

      {/* Login Button */}
      <TouchableOpacity
        className={`h-[50px] ${
          loading ? "bg-orange-400" : "bg-orange-500"
        } rounded-md items-center justify-center mb-6`}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-lg">
            Login to BIZ BOZZ
          </Text>
        )}
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View className="mt-0">
        <Text className="text-xl text-center font-semibold">
          New to BIZ BOZZ?
        </Text>
        <Link href="/signup" asChild>
          <TouchableOpacity className="mt-3">
            <Text className="text-center text-xl text-orange-500 font-semibold">
              Sign Up to Create Shop
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
