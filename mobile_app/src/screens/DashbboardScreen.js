import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getComplaints } from "../services/complaintService";
import {
  DASHBOARD_FILTERS,
  filterComplaints,
  getComplaintStats,
} from "../utils/complaintUtils";
import ComplaintCard from "./ComplaintCard";

export default function DashboardScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const response = await getComplaints();

      if (isMounted) {
        setData(response);
      }
    };

    loadData();
    const unsubscribe = navigation.addListener("focus", loadData);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    const response = await getComplaints();
    setData(response);
    setRefreshing(false);
  };

  const stats = useMemo(() => getComplaintStats(data), [data]);
  const filteredData = useMemo(() => filterComplaints(data, activeFilter), [activeFilter, data]);
  const openCount = stats.pending + stats.inProgress;

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <Text style={styles.eyebrow}>Complaint history</Text>
              <Text style={styles.title}>Track every issue</Text>
              <Text style={styles.subtitle}>Open, in progress, and solved complaints in one simple view.</Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{openCount}</Text>
                <Text style={styles.summaryLabel}>Open</Text>
              </View>
              <View style={[styles.summaryCard, styles.summaryCardCool]}>
                <Text style={styles.summaryValue}>{stats.inProgress}</Text>
                <Text style={styles.summaryLabel}>In progress</Text>
              </View>
              <View style={[styles.summaryCard, styles.summaryCardSuccess]}>
                <Text style={styles.summaryValue}>{stats.resolved}</Text>
                <Text style={styles.summaryLabel}>Solved</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.scanAction}
              onPress={() => navigation.navigate("Map", { openScanner: true })}
            >
              <View style={styles.scanIcon}>
                <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
              </View>
              <View style={styles.scanCopy}>
                <Text style={styles.scanTitle}>Scan a new hazard</Text>
                <Text style={styles.scanBody}>Pothole, garbage, waterlogging, or open drain.</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.filterRow}>
              {DASHBOARD_FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;

                return (
                  <TouchableOpacity
                    key={filter.key}
                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                    onPress={() => setActiveFilter(filter.key)}
                  >
                    <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No complaints in this view</Text>
            <Text style={styles.emptyBody}>
              Switch filters or submit a new complaint to start tracking its resolution status.
            </Text>
          </View>
        }
        renderItem={({ item }) => <ComplaintCard item={item} navigation={navigation} />}
        data={filteredData}
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
    gap: 12,
  },
  hero: {
    backgroundColor: "#14213d",
    borderRadius: 22,
    padding: 20,
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
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    marginTop: 10,
    color: "#dbe2ef",
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  summaryCardCool: {
    backgroundColor: "#edf6ff",
  },
  summaryCardSuccess: {
    backgroundColor: "#edfdf4",
  },
  summaryValue: {
    color: "#14213d",
    fontSize: 24,
    fontWeight: "800",
  },
  summaryLabel: {
    marginTop: 8,
    color: "#5c677d",
    fontWeight: "600",
  },
  scanAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 16,
  },
  scanIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    position: "relative",
  },
  scanCorner: {
    position: "absolute",
    width: 13,
    height: 13,
    borderColor: "#fff",
  },
  scanCornerTopLeft: {
    top: 9,
    left: 9,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 5,
  },
  scanCornerTopRight: {
    top: 9,
    right: 9,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 5,
  },
  scanCornerBottomLeft: {
    bottom: 9,
    left: 9,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 5,
  },
  scanCornerBottomRight: {
    bottom: 9,
    right: 9,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 5,
  },
  scanCopy: {
    flex: 1,
  },
  scanTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
  scanBody: {
    color: "#dbe2ef",
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    backgroundColor: "#f3efe7",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: "#14213d",
  },
  filterLabel: {
    color: "#5c677d",
    fontWeight: "700",
  },
  filterLabelActive: {
    color: "#fff",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    marginTop: 8,
  },
  emptyTitle: {
    color: "#14213d",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyBody: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 22,
  },
});
