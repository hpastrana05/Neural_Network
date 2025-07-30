import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import EditScreen from "./screens/EditScreen";
import { StyleSheet } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "MyGlyphMatrix",
            headerStyle: styles.headerStyle,
            headerTintColor: styles.headerTint.color,
            headerTitleStyle: styles.headerTitle,
          }}
        />
        <Stack.Screen
          name="Edit"
          component={EditScreen}
          options={{
            title: "Edit Animation",
            headerStyle: styles.headerStyle,
            headerTintColor: styles.headerTint.color,
            headerTitleStyle: styles.headerTitle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "#292929",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff", // For Android title color
  },
  headerTint: {
    color: "#fff", // For back button and icons
  },
});
