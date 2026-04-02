import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { Lora_400Regular, Lora_700Bold } from '@expo-google-fonts/lora';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';

import { AppProvider, useApp } from './src/context/AppContext';
import { getColors } from './src/theme';
import { RootStackParamList } from './src/types';

import TabletLayout from './src/screens/TabletLayout';
import FolderListScreen from './src/screens/FolderListScreen';
import NoteListScreen from './src/screens/NoteListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';

const Stack = createStackNavigator<RootStackParamList>();

function PhoneNavigator() {
  const { state } = useApp();
  const C = getColors(state.theme);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: C.surface },
          headerTintColor: C.accent,
          headerTitleStyle: { fontFamily: 'Outfit_600SemiBold', fontSize: 17, color: C.text },
          headerShadowVisible: false,
          cardStyle: { backgroundColor: C.bg },
        }}
      >
        <Stack.Screen
          name="Folders"
          component={FolderListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoteList"
          component={NoteListScreen}
          options={({ route }) => ({
            title: route.params.title,
            headerShown: true,
          })}
        />
        <Stack.Screen
          name="NoteEditor"
          component={NoteEditorScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function RootLayout() {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { state } = useApp();
  const C = getColors(state.theme);

  if (isTablet) {
    return (
      <SafeAreaProvider>
        <TabletLayout />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PhoneNavigator />
    </SafeAreaProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
    Outfit_400Regular,
    Outfit_600SemiBold,
    JetBrainsMono_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f11', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#7c6af7" size="large" />
      </View>
    );
  }

  return (
    <AppProvider>
      <RootLayout />
    </AppProvider>
  );
}
