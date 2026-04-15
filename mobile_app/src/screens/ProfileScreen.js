import React, { useContext } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, setUser } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Resident profile</Text>
          <Text style={styles.name}>{user?.name || "Demo Citizen"}</Text>
          <Text style={styles.email}>{user?.email || "citizen@urbaneye.dev"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Role</Text>
          <Text style={styles.cardValue}>{user?.role || "CITIZEN"}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => setUser(null)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    gap: 16,
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
  name: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
  email: {
    color: "#dbe2ef",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
  },
  cardLabel: {
    color: "#6b7280",
    fontSize: 13,
  },
  cardValue: {
    color: "#14213d",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#ef8354",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
