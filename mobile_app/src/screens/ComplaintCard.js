import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ComplaintCard({ item, navigation }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Detail", { item })}>
      <View style={styles.row}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.status}>{String(item.status).replace("_", " ")}</Text>
      </View>
      <Text style={styles.title}>{item.title || item.description}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>Priority {item.priority}</Text>
        <Text style={styles.meta}>{item.department}</Text>
      </View>
      <Text style={styles.location}>{item.location}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 22,
    shadowColor: "#14213d",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  status: {
    color: "#2a9d8f",
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    marginTop: 10,
    color: "#14213d",
    fontSize: 18,
    fontWeight: "800",
  },
  description: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  meta: {
    backgroundColor: "#eef2f7",
    color: "#14213d",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "600",
  },
  location: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: 13,
  },
});
