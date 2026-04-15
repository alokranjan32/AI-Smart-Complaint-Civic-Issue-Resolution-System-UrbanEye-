import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ReportScreen from "../screens/ReportScreen";
import DashboardScreen from "../screens/DashbboardScreen";
import ComplaintDetailScreen from "../screens/ComplaintDetailScreen";
import MapScreen from "../screens/map";
import ProfileScreen from "../screens/ProfileScreen";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: "#f4efe6",
        },
        headerShadowVisible: false,
        headerTintColor: "#14213d",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: "UrbanEye" }} />
          <Stack.Screen name="Report" component={ReportScreen} options={{ title: "Report Issue" }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Dashboard" }} />
          <Stack.Screen name="Detail" component={ComplaintDetailScreen} options={{ title: "Complaint Detail" }} />
          <Stack.Screen name="Map" component={MapScreen} options={{ title: "Hotspot Map" }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}
