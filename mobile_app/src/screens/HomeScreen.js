import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const actions = [
  { label: "Report Issue", screen: "Report", tone: "#14213d" },
  { label: "View Dashboard", screen: "Dashboard", tone: "#ef8354" },
  { label: "Map Hotspots", screen: "Map", tone: "#2a9d8f" },
  { label: "Profile", screen: "Profile", tone: "#4f5d75" },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>UrbanEye</Text>
          <Text style={styles.title}>Civic response at street level</Text>
          <Text style={styles.subtitle}>
            Report local issues, track triage, and follow status updates without leaving the app.
          </Text>
        </View>

        <View style={styles.grid}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.screen}
              style={[styles.card, { borderLeftColor: action.tone }]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <Text style={styles.cardLabel}>{action.label}</Text>
              <Text style={styles.cardHint}>Open</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  hero: {
    backgroundColor: "#14213d",
    borderRadius: 28,
    padding: 24,
  },
  eyebrow: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },
  subtitle: {
    color: "#dbe2ef",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  grid: {
    gap: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderLeftWidth: 6,
    shadowColor: "#14213d",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardLabel: {
    color: "#14213d",
    fontSize: 18,
    fontWeight: "700",
  },
  cardHint: {
    marginTop: 6,
    color: "#6b7280",
  },
});
