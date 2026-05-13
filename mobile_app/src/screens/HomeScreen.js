import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AuthContext } from "../context/AuthContext";
import { getUserAlerts } from "../services/alertService";
import { getComplaints } from "../services/complaintService";
import { getComplaintStats } from "../utils/complaintUtils";

const actions = [
  {
    label: "Report a new issue",
    hint: "Capture a fresh complaint with location and photo evidence.",
    screen: "Report",
    tone: "#14213d",
  },
  {
    label: "Open complaint dashboard",
    hint: "See which complaints are solved, in progress, or still waiting.",
    screen: "Dashboard",
    tone: "#ef8354",
  },
  {
    label: "Review hotspot map",
    hint: "Scan city trouble zones and active civic clusters.",
    screen: "Map",
    tone: "#2a9d8f",
  },
  {
    label: "Manage your profile",
    hint: "Update resident details and connect your X account.",
    screen: "Profile",
    tone: "#6c7aa1",
  },
];

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadComplaints = async () => {
      const response = await getComplaints();

      if (isMounted) {
        setComplaints(response);
      }
    };

    loadComplaints();

    const loadAlerts = async () => {
      if (!user?.id || !user?.alertsEnabled) {
        if (isMounted) {
          setAlerts([]);
        }
        return;
      }

      const response = await getUserAlerts(user.id);
      if (isMounted) {
        setAlerts(response);
      }
    };

    loadAlerts();
    const unsubscribe = navigation.addListener("focus", loadComplaints);
    const alertsUnsubscribe = navigation.addListener("focus", loadAlerts);

    return () => {
      isMounted = false;
      unsubscribe();
      alertsUnsubscribe();
    };
  }, [navigation, user?.alertsEnabled, user?.id]);

  const stats = getComplaintStats(complaints);
  const openCount = stats.pending + stats.inProgress;
  const alertsPreviewCount = alerts.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>UrbanEye citizen app</Text>
          <Text style={styles.title}>Stay on top of every civic complaint</Text>
          <Text style={styles.subtitle}>
            Report issues, monitor whether they are solved yet, and keep your public update channel ready.
          </Text>

          <View style={styles.heroSignalRow}>
            <View style={styles.heroSignal}>
              <View style={[styles.heroSignalDot, { backgroundColor: "#ef8354" }]} />
              <Text style={styles.heroSignalText}>Live civic tracking</Text>
            </View>
            <View style={styles.heroSignal}>
              <View style={[styles.heroSignalDot, { backgroundColor: "#2a9d8f" }]} />
              <Text style={styles.heroSignalText}>
                {user?.alertsEnabled ? "Nearby alerts on" : "Enable nearby alerts"}
              </Text>
            </View>
          </View>

          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeValue}>{stats.resolved}</Text>
              <Text style={styles.heroBadgeLabel}>Solved</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeValue}>{stats.pending + stats.inProgress}</Text>
              <Text style={styles.heroBadgeLabel}>Open</Text>
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeValue}>{user?.xHandle ? "Yes" : "Add"}</Text>
              <Text style={styles.heroBadgeLabel}>X linked</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.scanCard}
          onPress={() => navigation.navigate("Map", { openScanner: true })}
        >
          <View style={styles.scanIconBox}>
            <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
            <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
            <View style={styles.scanBeam} />
          </View>
          <View style={styles.scanCardCopy}>
            <Text style={styles.scanCardTitle}>Scan civic hazard</Text>
            <Text style={styles.scanCardBody}>Open the scanner for potholes, garbage, waterlogging, or open drains.</Text>
          </View>
          <View style={styles.scanCardPill}>
            <Text style={styles.scanCardPillText}>Scan</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>Quick status snapshot</Text>
            <Text style={styles.sectionMeta}>Live view</Text>
          </View>
          <View style={styles.statGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Complaints tracked</Text>
            </View>
            <View style={[styles.statCard, styles.statCardWarm]}>
              <Text style={styles.statValue}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Waiting for action</Text>
            </View>
            <View style={[styles.statCard, styles.statCardCool]}>
              <Text style={styles.statValue}>{stats.inProgress}</Text>
              <Text style={styles.statLabel}>In progress</Text>
            </View>
          </View>
          <View style={styles.insightStrip}>
            <View style={styles.insightChip}>
              <View style={[styles.insightDot, { backgroundColor: "#14213d" }]} />
              <Text style={styles.insightText}>{openCount} still need follow-up</Text>
            </View>
            <View style={styles.insightChip}>
              <View style={[styles.insightDot, { backgroundColor: "#ef8354" }]} />
              <Text style={styles.insightText}>{alertsPreviewCount} nearby alerts loaded</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <Text style={styles.sectionMeta}>Go faster</Text>
          </View>
          <View style={styles.actionList}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.screen}
                style={[styles.actionCard, { borderLeftColor: action.tone }]}
                onPress={() => navigation.navigate(action.screen)}
              >
                <View style={styles.actionTopRow}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <View style={[styles.actionPill, { backgroundColor: `${action.tone}18` }]}>
                    <Text style={[styles.actionPillText, { color: action.tone }]}>Open</Text>
                  </View>
                </View>
                <Text style={styles.actionHint}>{action.hint}</Text>
                <Text style={styles.actionCta}>Tap to continue</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>Nearby hazard alerts</Text>
            <Text style={styles.sectionMeta}>Location based</Text>
          </View>
          {user?.alertsEnabled ? (
            alerts.length ? (
              <View style={styles.alertList}>
                {alerts.slice(0, 3).map((alert) => (
                  <View key={alert.id} style={styles.alertCard}>
                    <View style={styles.alertTopRow}>
                      <Text style={styles.alertSeverity}>{alert.severity}</Text>
                      <Text style={styles.alertDistance}>{alert.distanceKm} km away</Text>
                    </View>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertBody}>{alert.message}</Text>
                    <Text style={styles.alertLocation}>{alert.location}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyAlertCard}>
                <Text style={styles.emptyAlertTitle}>No nearby hazards right now</Text>
                <Text style={styles.emptyAlertBody}>
                  Your alert location is active, and there are no open high-risk complaints in range.
                </Text>
              </View>
            )
          ) : (
            <View style={styles.emptyAlertCard}>
              <Text style={styles.emptyAlertTitle}>Enable alerts from Profile</Text>
              <Text style={styles.emptyAlertBody}>
                Save your location in Profile to receive pothole, road damage, and waterlogging warnings nearby.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.socialCard}>
          <View style={styles.sectionHeadingRow}>
            <Text style={styles.sectionTitle}>X account connection</Text>
            <Text style={styles.sectionMeta}>Profile sync</Text>
          </View>
          <Text style={styles.socialBody}>
            {user?.xHandle
              ? `Connected as @${user.xHandle}. Your complaint updates can now reference your preferred X handle.`
              : "Add your X handle in Profile so complaint-related posts and updates can be prepared around your public account."}
          </Text>
          <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate("Profile")}>
            <Text style={styles.socialButtonText}>{user?.xHandle ? "Manage X account" : "Add X account"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  hero: {
    backgroundColor: "#14213d",
    borderRadius: 28,
    padding: 24,
    overflow: "hidden",
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
  heroSignalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  heroSignal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  heroSignalDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  heroSignalText: {
    color: "#f7f2eb",
    fontSize: 12,
    fontWeight: "700",
  },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  heroBadge: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  heroBadgeValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  heroBadgeLabel: {
    marginTop: 6,
    color: "#dbe2ef",
    fontSize: 12,
    fontWeight: "600",
  },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#101827",
    borderRadius: 28,
    padding: 16,
    shadowColor: "#14213d",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 8,
  },
  scanIconBox: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.08)",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  scanCorner: {
    position: "absolute",
    width: 15,
    height: 15,
    borderColor: "#fff",
  },
  scanCornerTopLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 5,
  },
  scanCornerTopRight: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 5,
  },
  scanCornerBottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 5,
  },
  scanCornerBottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 5,
  },
  scanBeam: {
    width: 34,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#ef8354",
  },
  scanCardCopy: {
    flex: 1,
  },
  scanCardTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
  },
  scanCardBody: {
    color: "#dbe2ef",
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
  scanCardPill: {
    borderRadius: 999,
    backgroundColor: "#ef8354",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scanCardPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  section: {
    gap: 14,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: "#14213d",
    fontSize: 22,
    fontWeight: "800",
  },
  sectionMeta: {
    color: "#6c7aa1",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#14213d",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  statCardWarm: {
    backgroundColor: "#fff7eb",
  },
  statCardCool: {
    backgroundColor: "#edf6ff",
  },
  statValue: {
    color: "#14213d",
    fontSize: 26,
    fontWeight: "800",
  },
  statLabel: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 20,
  },
  insightStrip: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  insightChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.76)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  insightDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  insightText: {
    color: "#44506a",
    fontSize: 12,
    fontWeight: "700",
  },
  actionList: {
    gap: 14,
  },
  actionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  alertList: {
    gap: 12,
  },
  alertCard: {
    backgroundColor: "#fff5f1",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#f0d2c4",
    padding: 16,
  },
  alertTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  alertSeverity: {
    color: "#b42318",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  alertDistance: {
    color: "#7b8794",
    fontSize: 12,
    fontWeight: "700",
  },
  alertTitle: {
    color: "#14213d",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 10,
  },
  alertBody: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 21,
  },
  alertLocation: {
    marginTop: 10,
    color: "#14213d",
    fontWeight: "700",
  },
  emptyAlertCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e7dccd",
  },
  emptyAlertTitle: {
    color: "#14213d",
    fontWeight: "800",
    fontSize: 16,
  },
  emptyAlertBody: {
    marginTop: 10,
    color: "#5c677d",
    lineHeight: 21,
  },
  actionCard: {
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
  actionLabel: {
    color: "#14213d",
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  actionPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  actionHint: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 21,
  },
  actionCta: {
    marginTop: 14,
    color: "#6c7aa1",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  socialCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e7dccd",
  },
  socialBody: {
    marginTop: 10,
    color: "#5c677d",
    lineHeight: 22,
  },
  socialButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    backgroundColor: "#ef8354",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
