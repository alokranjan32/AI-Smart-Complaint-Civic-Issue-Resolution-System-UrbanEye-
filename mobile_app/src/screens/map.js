import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";

import { getHotspots } from "../services/mapService";

const DEFAULT_REGION = {
  latitude: 25.6041,
  longitude: 85.1376,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const SCAN_TYPES = [
  { label: "Pothole", detail: "Road hazard", color: "#d62828" },
  { label: "Garbage", detail: "Sanitation issue", color: "#2a9d8f" },
  { label: "Waterlogging", detail: "Flooded zone", color: "#2563eb" },
  { label: "Open drain", detail: "Accident risk", color: "#ef8354" },
];

function getMarkerColor(category) {
  switch (category) {
    case "Roads":
      return "#d62828";
    case "Water":
      return "#2563eb";
    case "Sanitation":
      return "#2a9d8f";
    case "Electricity":
      return "#f59e0b";
    default:
      return "#6c7aa1";
  }
}

function getPriorityTone(priority) {
  switch (priority) {
    case "CRITICAL":
      return { bg: "rgba(214,40,40,0.14)", fg: "#b42318", label: "Critical" };
    case "HIGH":
      return { bg: "rgba(239,131,84,0.16)", fg: "#d95d2b", label: "High" };
    case "MEDIUM":
      return { bg: "rgba(245,158,11,0.16)", fg: "#b7791f", label: "Medium" };
    case "LOW":
      return { bg: "rgba(42,157,143,0.14)", fg: "#1d7f73", label: "Low" };
    default:
      return { bg: "rgba(108,122,161,0.14)", fg: "#55627f", label: priority || "Unknown" };
  }
}

function buildRegion(markers) {
  if (!markers.length) {
    return DEFAULT_REGION;
  }

  const latitudeValues = markers.map((item) => item.latitude);
  const longitudeValues = markers.map((item) => item.longitude);

  const minLatitude = Math.min(...latitudeValues);
  const maxLatitude = Math.max(...latitudeValues);
  const minLongitude = Math.min(...longitudeValues);
  const maxLongitude = Math.max(...longitudeValues);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.8, 0.03),
    longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.8, 0.03),
  };
}

export default function MapScreen({ navigation, route }) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedScanType, setSelectedScanType] = useState(SCAN_TYPES[0]);

  useEffect(() => {
    let isMounted = true;

    const loadHotspots = async () => {
      setLoading(true);

      const response = await getHotspots();
      if (isMounted) {
        setMarkers(response);
        setLoading(false);
      }
    };

    loadHotspots();
    const unsubscribe = navigation.addListener("focus", loadHotspots);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.openScanner) {
      setScannerOpen(true);
      navigation.setParams({ openScanner: false });
    }
  }, [navigation, route?.params?.openScanner]);

  const region = useMemo(() => buildRegion(markers), [markers]);
  const openCount = useMemo(
    () => markers.filter((item) => item.status !== "RESOLVED").length,
    [markers],
  );
  const highRiskCount = useMemo(
    () => markers.filter((item) => ["CRITICAL", "HIGH"].includes(item.priority)).length,
    [markers],
  );
  const categoryCount = useMemo(() => new Set(markers.map((item) => item.category)).size, [markers]);
  const topHotspots = useMemo(() => markers.slice(0, 3), [markers]);

  const openScanner = () => setScannerOpen(true);

  const startReportFromScanner = () => {
    setScannerOpen(false);
    navigation.navigate("Report", {
      scanPreset: {
        title: selectedScanType.label,
        description: `${selectedScanType.detail} scanned from the live hotspot map.`,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Live hotspot map</Text>
          <Text style={styles.title}>Real complaint coordinates from UrbanEye</Text>
          <Text style={styles.subtitle}>
            View active civic complaints by location and scan which city zones need attention first.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{markers.length}</Text>
            <Text style={styles.summaryLabel}>Mapped complaints</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardWarm]}>
            <Text style={styles.summaryValue}>{openCount}</Text>
            <Text style={styles.summaryLabel}>Still open</Text>
          </View>
        </View>

        <View style={styles.insightRow}>
          <View style={styles.insightChip}>
            <View style={[styles.insightDot, { backgroundColor: "#d62828" }]} />
            <Text style={styles.insightText}>{highRiskCount} high risk</Text>
          </View>
          <View style={styles.insightChip}>
            <View style={[styles.insightDot, { backgroundColor: "#2a9d8f" }]} />
            <Text style={styles.insightText}>{categoryCount} issue groups</Text>
          </View>
          <View style={styles.insightChip}>
            <View style={[styles.insightDot, { backgroundColor: "#2563eb" }]} />
            <Text style={styles.insightText}>Live field view</Text>
          </View>
        </View>

        <View style={styles.mapShell}>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator color="#ef8354" size="large" />
              <Text style={styles.loaderText}>Loading live hotspot map...</Text>
            </View>
          ) : (
            <>
              <MapView style={styles.map} initialRegion={region} region={region}>
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                    }}
                    pinColor={getMarkerColor(marker.category)}
                  >
                    <Callout>
                      <View style={styles.callout}>
                        <Text style={styles.calloutTitle}>{marker.title}</Text>
                        <Text style={styles.calloutBody}>{marker.location}</Text>
                        <Text style={styles.calloutMeta}>
                          {marker.category} • {marker.priority} • {marker.status.replace("_", " ")}
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                ))}
              </MapView>

              <View pointerEvents="box-none" style={styles.mapOverlay}>
                <View style={styles.overlayBadge}>
                  <Text style={styles.overlayBadgeText}>Live civic scanner</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {topHotspots.length ? (
          <View style={styles.hotspotSection}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>Latest hotspots</Text>
              <Text style={styles.sectionMeta}>Live feed</Text>
            </View>
            {topHotspots.map((marker) => {
              const tone = getPriorityTone(marker.priority);

              return (
                <Pressable
                  key={marker.id}
                  onPress={() => navigation.navigate("Report")}
                  style={styles.hotspotCard}
                >
                  <View style={styles.hotspotTopRow}>
                    <View style={styles.hotspotCategoryRow}>
                      <View
                        style={[
                          styles.hotspotCategoryDot,
                          { backgroundColor: getMarkerColor(marker.category) },
                        ]}
                      />
                      <Text style={styles.hotspotCategory}>{marker.category}</Text>
                    </View>
                    <View style={[styles.priorityPill, { backgroundColor: tone.bg }]}>
                      <Text style={[styles.priorityPillText, { color: tone.fg }]}>{tone.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.hotspotTitle}>{marker.title}</Text>
                  <Text style={styles.hotspotLocation}>{marker.location}</Text>
                  <View style={styles.hotspotFooter}>
                    <Text style={styles.hotspotStatus}>{marker.status.replace("_", " ")}</Text>
                    <Text style={styles.hotspotAction}>Open report</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {!loading && markers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No live hotspots yet</Text>
            <Text style={styles.emptyBody}>
              Once complaints with real coordinates are submitted, they will appear here on the map.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View pointerEvents="box-none" style={styles.fixedScannerWrap}>
        <Pressable
          accessibilityLabel="Open pothole and garbage scanner"
          onPress={openScanner}
          style={({ pressed }) => [
            styles.fixedScannerButton,
            pressed ? styles.fixedScannerButtonPressed : null,
          ]}
        >
          <View style={styles.fixedScannerIcon}>
            <View style={[styles.scannerCorner, styles.cornerTopLeft]} />
            <View style={[styles.scannerCorner, styles.cornerTopRight]} />
            <View style={[styles.scannerCorner, styles.cornerBottomLeft]} />
            <View style={[styles.scannerCorner, styles.cornerBottomRight]} />
            <View style={styles.scannerLine} />
            <View style={styles.scannerDot} />
          </View>
          <View style={styles.fixedScannerTextBlock}>
            <Text style={styles.fixedScannerTitle}>Scan & Report</Text>
            <Text style={styles.fixedScannerSubtitle}>Pothole, garbage, water hazard</Text>
          </View>
        </Pressable>
      </View>

      <Modal transparent visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        <View style={styles.scannerModalBackdrop}>
          <View style={styles.scannerModal}>
            <View style={styles.scannerModalTop}>
              <View>
                <Text style={styles.scannerModalEyebrow}>UrbanEye scanner</Text>
                <Text style={styles.scannerModalTitle}>Point at the civic hazard</Text>
              </View>
              <Pressable onPress={() => setScannerOpen(false)} style={styles.scannerCloseButton}>
                <Text style={styles.scannerCloseText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.scanViewport}>
              <View style={[styles.scanViewportCorner, styles.scanTopLeft]} />
              <View style={[styles.scanViewportCorner, styles.scanTopRight]} />
              <View style={[styles.scanViewportCorner, styles.scanBottomLeft]} />
              <View style={[styles.scanViewportCorner, styles.scanBottomRight]} />
              <View style={styles.scanGlow} />
              <View style={styles.scanBeam} />
              <Text style={styles.scanViewportText}>{selectedScanType.label}</Text>
            </View>

            <View style={styles.scanTypeGrid}>
              {SCAN_TYPES.map((type) => {
                const isSelected = selectedScanType.label === type.label;
                return (
                  <Pressable
                    key={type.label}
                    onPress={() => setSelectedScanType(type)}
                    style={[
                      styles.scanTypeCard,
                      isSelected ? styles.scanTypeCardSelected : null,
                    ]}
                  >
                    <View style={[styles.scanTypeDot, { backgroundColor: type.color }]} />
                    <Text style={styles.scanTypeLabel}>{type.label}</Text>
                    <Text style={styles.scanTypeDetail}>{type.detail}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={startReportFromScanner} style={styles.scanPrimaryButton}>
              <Text style={styles.scanPrimaryText}>Report scanned issue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 132,
    gap: 16,
  },
  header: {
    backgroundColor: "#14213d",
    borderRadius: 28,
    padding: 22,
  },
  eyebrow: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: "#fff",
    marginTop: 8,
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    color: "#dbe2ef",
    marginTop: 10,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
  },
  summaryCardWarm: {
    backgroundColor: "#fff8f2",
  },
  summaryValue: {
    color: "#14213d",
    fontSize: 24,
    fontWeight: "800",
  },
  summaryLabel: {
    color: "#5c677d",
    marginTop: 8,
    fontWeight: "600",
  },
  insightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  insightChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.76)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  insightDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },
  insightText: {
    color: "#44506a",
    fontSize: 13,
    fontWeight: "700",
  },
  mapShell: {
    overflow: "hidden",
    borderRadius: 28,
    minHeight: 420,
    backgroundColor: "#fff",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(20,33,61,0.08)",
  },
  map: {
    width: "100%",
    height: 420,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    padding: 16,
  },
  overlayBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(20,33,61,0.78)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  overlayBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  fixedScannerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    alignItems: "center",
  },
  fixedScannerButton: {
    width: "100%",
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#14213d",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#14213d",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  fixedScannerButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  fixedScannerIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.08)",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  fixedScannerTextBlock: {
    flex: 1,
  },
  fixedScannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  fixedScannerSubtitle: {
    color: "#dbe2ef",
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  scannerCorner: {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: "#f4efe6",
  },
  cornerTopLeft: {
    top: 8,
    left: 8,
    borderLeftWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopLeftRadius: 5,
  },
  cornerTopRight: {
    top: 8,
    right: 8,
    borderRightWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopRightRadius: 5,
  },
  cornerBottomLeft: {
    bottom: 8,
    left: 8,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomLeftRadius: 5,
  },
  cornerBottomRight: {
    bottom: 8,
    right: 8,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomRightRadius: 5,
  },
  scannerDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ef8354",
  },
  scannerLine: {
    position: "absolute",
    left: 14,
    right: 14,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#ef8354",
  },
  scannerModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(8,13,26,0.82)",
    justifyContent: "flex-end",
  },
  scannerModal: {
    backgroundColor: "#101827",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 18,
    paddingBottom: 28,
    gap: 18,
  },
  scannerModalTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  scannerModalEyebrow: {
    color: "#ef8354",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  scannerModalTitle: {
    color: "#fff",
    marginTop: 6,
    fontSize: 22,
    fontWeight: "900",
  },
  scannerCloseButton: {
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  scannerCloseText: {
    color: "#fff",
    fontWeight: "800",
  },
  scanViewport: {
    height: 250,
    borderRadius: 28,
    backgroundColor: "#17223a",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  scanViewportCorner: {
    position: "absolute",
    width: 54,
    height: 54,
    borderColor: "#ffffff",
  },
  scanTopLeft: {
    top: 24,
    left: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 14,
  },
  scanTopRight: {
    top: 24,
    right: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 14,
  },
  scanBottomLeft: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 14,
  },
  scanBottomRight: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 14,
  },
  scanGlow: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "rgba(239,131,84,0.16)",
  },
  scanBeam: {
    position: "absolute",
    left: 38,
    right: 38,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#ef8354",
    shadowColor: "#ef8354",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
  },
  scanViewportText: {
    position: "absolute",
    bottom: 42,
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  scanTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  scanTypeCard: {
    width: "48%",
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    padding: 14,
  },
  scanTypeCardSelected: {
    backgroundColor: "rgba(239,131,84,0.18)",
    borderColor: "#ef8354",
  },
  scanTypeDot: {
    width: 11,
    height: 11,
    borderRadius: 999,
    marginBottom: 10,
  },
  scanTypeLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  scanTypeDetail: {
    color: "#b9c4d8",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  scanPrimaryButton: {
    borderRadius: 999,
    backgroundColor: "#ef8354",
    paddingVertical: 16,
    alignItems: "center",
  },
  scanPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  hotspotSection: {
    gap: 12,
  },
  sectionHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionMeta: {
    color: "#6c7aa1",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  hotspotCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(20,33,61,0.08)",
    shadowColor: "#14213d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  hotspotTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  hotspotCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hotspotCategoryDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  hotspotCategory: {
    color: "#6c7aa1",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  priorityPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priorityPillText: {
    fontSize: 12,
    fontWeight: "800",
  },
  hotspotTitle: {
    marginTop: 12,
    color: "#14213d",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
  },
  hotspotLocation: {
    marginTop: 8,
    color: "#5c677d",
    fontSize: 15,
    lineHeight: 22,
  },
  hotspotFooter: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hotspotStatus: {
    color: "#6c7aa1",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  hotspotAction: {
    color: "#ef8354",
    fontSize: 13,
    fontWeight: "800",
  },
  loader: {
    minHeight: 420,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loaderText: {
    color: "#4f5d75",
    fontWeight: "600",
  },
  callout: {
    width: 220,
    paddingVertical: 4,
  },
  calloutTitle: {
    color: "#14213d",
    fontWeight: "800",
  },
  calloutBody: {
    color: "#4f5d75",
    marginTop: 6,
  },
  calloutMeta: {
    color: "#6b7280",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
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
