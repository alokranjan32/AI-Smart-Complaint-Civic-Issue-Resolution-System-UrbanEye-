import React from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { getPriorityMeta, getStatusMeta } from "../utils/complaintUtils";

export default function ComplaintCard({ item, navigation }) {
  const statusMeta = getStatusMeta(item.status);
  const priorityMeta = getPriorityMeta(item.priority);

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Detail", { item })}>
      <View style={styles.topRow}>
        <Text style={styles.category}>{item.category}</Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: statusMeta.backgroundColor,
              borderColor: statusMeta.borderColor,
            },
          ]}
        >
          <Text style={[styles.statusText, { color: statusMeta.textColor }]}>{statusMeta.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{item.title || item.description}</Text>
      <Text style={styles.location}>{item.location}</Text>

      <View style={styles.metaRow}>
        <Text
          style={[
            styles.meta,
            {
              backgroundColor: priorityMeta.backgroundColor,
              color: priorityMeta.textColor,
            },
          ]}
        >
          Priority {priorityMeta.label}
        </Text>
        <Text style={styles.meta}>{item.department || "Civic Response Cell"}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>{statusMeta.shortLabel}</Text>
        <Text style={styles.footerHint}>View history</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ece3d6",
    shadowColor: "#14213d",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  category: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  title: {
    marginTop: 10,
    color: "#14213d",
    fontSize: 18,
    fontWeight: "800",
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
    marginTop: 8,
    color: "#6b7280",
    fontSize: 13,
  },
  footerRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1ebe1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  footerLabel: {
    color: "#14213d",
    fontWeight: "700",
  },
  footerHint: {
    color: "#7b8794",
    fontSize: 12,
    fontWeight: "600",
  },
});
