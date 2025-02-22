import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-bold text-gray-800">Favorites</Text>
      </View>
    </SafeAreaView>
  );
}
