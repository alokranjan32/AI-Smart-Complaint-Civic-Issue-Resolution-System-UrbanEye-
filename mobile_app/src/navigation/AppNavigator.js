import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
  const { isHydrated, user } = useContext(AuthContext);

  if (!isHydrated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingCard}>
          <ActivityIndicator color="#ef8354" size="large" />
          <Text style={styles.loadingTitle}>Loading your civic workspace</Text>
          <Text style={styles.loadingBody}>Restoring profile, complaint tracker, and saved X account.</Text>
        </View>
      </SafeAreaView>
    );
  }

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    backgroundColor: "#14213d",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
  },
  loadingTitle: {
    marginTop: 18,
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  loadingBody: {
    marginTop: 10,
    color: "#dbe2ef",
    lineHeight: 22,
    textAlign: "center",
  },
});
