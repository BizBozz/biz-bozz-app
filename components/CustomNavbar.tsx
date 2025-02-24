import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";

const menuItems = [
  { path: "/(app)/home" as const, label: "Home", icon: "home-outline" },
  {
    path: "/(app)/explore" as const,
    label: "Explore",
    icon: "compass-outline",
  },
] as const;

export default function CustomNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuHeight = useRef(new Animated.Value(0)).current;
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    Animated.timing(menuHeight, {
      toValue: isMenuOpen ? 0 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      {/* Top Bar */}
      <View className="flex-row justify-between items-center px-4 py-4 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons
            name={isMenuOpen ? "close" : "menu"}
            size={24}
            color="#FF6B00"
          />
        </TouchableOpacity>
        {/* <Text className="text-lg font-bold">BizBozz</Text> */}
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#FF6B00" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      <Animated.View
        className="bg-white border-b border-gray-200"
        style={{ height: menuHeight }}
      >
        <View className="flex-row flex-wrap p-4 gap-4">
          {menuItems.map((item) => (
            <Link href={item.path} key={item.path} asChild>
              <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg ${
                  pathname.startsWith(item.path) ? "bg-orange-50" : ""
                }`}
                style={{ width: "45%" }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={pathname.startsWith(item.path) ? "#FF6B00" : "#8E8E93"}
                />
                <Text
                  className={`ml-2 ${
                    pathname.startsWith(item.path)
                      ? "text-orange-500 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
