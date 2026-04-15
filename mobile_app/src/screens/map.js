import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const markers = [
  {
    id: "cmp-1001",
    title: "Garbage hotspot",
    description: "Sector 8 Market, Patna",
    latitude: 25.6175,
    longitude: 85.1452,
  },
  {
    id: "cmp-1002",
    title: "Streetlight outage",
    description: "Boring Road Crossing, Patna",
    latitude: 25.6128,
    longitude: 85.1178,
  },
  {
    id: "cmp-1003",
    title: "Water leakage",
    description: "Kankarbagh Main Road, Patna",
    latitude: 25.5944,
    longitude: 85.1612,
  },
];

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Hotspots</Text>
        <Text style={styles.title}>Complaint density map</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 25.6041,
          longitude: 85.1376,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  eyebrow: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: "#14213d",
    marginTop: 6,
    fontSize: 24,
    fontWeight: "800",
  },
  map: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
  },
});
