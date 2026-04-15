import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { getComplaints } from "../services/complaintService";
import ComplaintCard from "./ComplaintCard";

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const res = await getComplaints();
    setData(res);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Operations board</Text>
            <Text style={styles.title}>Tracked civic complaints</Text>
            <Text style={styles.subtitle}>
              Monitor active complaints, view AI triage suggestions, and open details for follow-up.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ComplaintCard item={item} navigation={navigation} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  header: {
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 20,
    marginBottom: 10,
  },
  eyebrow: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: "800",
    color: "#14213d",
  },
  subtitle: {
    marginTop: 10,
    color: "#5c677d",
    lineHeight: 22,
  },
});
