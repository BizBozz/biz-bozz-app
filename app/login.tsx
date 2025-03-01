import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { handleSignIn } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertModal from "./components/AlertModal";
import logo from "./../assets/images/logo.png";

export default function LoginScreen() {
  const [phone_number, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    if (!phone_number || !password) {
      setAlertMessage("Please fill in all fields");
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    const res = await handleSignIn({ phone_number, password });
    console.log(res);
    if (res?.data?.statusCode === 200) {
      setLoading(false);
      router.push("/(app)/home");
      AsyncStorage.setItem("biz-bozz-token", res.data.token);
    } else {
      setLoading(false);
      if (res?.response?.status === 401) {
        setAlertMessage("Unauthorized: Please check your credentials");
      } else {
        setAlertMessage("Invalid credentials");
      }
      setAlertVisible(true);
    }
    // console.log(res);
  };

  return (
    <View className="flex-1 bg-white px-4 pt-[50px]">
      <Image source={logo} className="w-10 h-10 mb-10" />

      <Text className="text-[30px] font-bold mb-10 mt-[30px]">
        Login to BizBozz
      </Text>

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
        <Text className="text-2xl border-t border-gray-300 pt-5 font-semibold">
          Don't Have Account?
        </Text>
        <Link href="/signup" asChild>
          <TouchableOpacity className="mt-5">
            <Text className="text-center bg-orange-100 py-4 text-xl text-orange-500 font-semibold">
              Sign Up to Create Shop
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <AlertModal
        visible={alertVisible}
        title="Phone Number or Password is incorrect"
        message={alertMessage}
        buttons={[{ text: "OK", onPress: () => setAlertVisible(false) }]}
      />
    </View>
  );
}
