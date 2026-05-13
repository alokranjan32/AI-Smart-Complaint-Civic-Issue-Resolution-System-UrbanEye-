import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { createComplaint } from "../services/complaintService";

export default function ReportScreen({ navigation, route }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState(null);

  const scanPreset = route?.params?.scanPreset;

  useEffect(() => {
    if (!scanPreset) {
      return;
    }

    if (scanPreset.title) {
      setTitle(scanPreset.title);
    }

    if (scanPreset.description) {
      setDescription(scanPreset.description);
    }
  }, [scanPreset]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Camera permission needed", "Allow camera access to scan and attach the issue photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.75,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert("Missing details", "Please complete title, description, and location.");
      return;
    }

    try {
      let liveCoords = coords;

      if (!liveCoords) {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (permission.status === "granted") {
          const currentPosition = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          liveCoords = {
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
          };
          setCoords(liveCoords);
        }
      }

      await createComplaint({
        title,
        description,
        location,
        image,
        latitude: liveCoords?.latitude,
        longitude: liveCoords?.longitude,
      });

      Alert.alert("Success", "Complaint submitted");
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
      setCoords(null);
      navigation.navigate("Dashboard");
    } catch (error) {
      Alert.alert("Error", "Failed to submit complaint");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Report issue</Text>
          <Text style={styles.title}>Send a civic complaint for AI triage</Text>
        </View>

        <View style={styles.form}>
          {scanPreset ? (
            <View style={styles.scanBanner}>
              <View style={styles.scanIcon}>
                <View style={[styles.scanCorner, styles.scanCornerTopLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerTopRight]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomLeft]} />
                <View style={[styles.scanCorner, styles.scanCornerBottomRight]} />
              </View>
              <View style={styles.scanBannerText}>
                <Text style={styles.scanBannerTitle}>Scanner report ready</Text>
                <Text style={styles.scanBannerBody}>Attach a photo and current location for stronger tracking.</Text>
              </View>
            </View>
          ) : null}

          <TextInput
            placeholder="Issue title"
            placeholderTextColor="#8d99ae"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            placeholder="Describe the issue"
            placeholderTextColor="#8d99ae"
            style={[styles.input, styles.textarea]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            placeholder="Location"
            placeholderTextColor="#8d99ae"
            style={styles.input}
            value={location}
            onChangeText={setLocation}
          />

          {coords ? (
            <View style={styles.locationBadge}>
              <Text style={styles.locationBadgeText}>
                Coordinates attached: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>{image ? "Change image" : "Upload image"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraButton} onPress={captureImage}>
            <Text style={styles.cameraText}>{image ? "Retake scan photo" : "Open camera scanner"}</Text>
          </TouchableOpacity>

          {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Complaint</Text>
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
    gap: 18,
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
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    color: "#fff",
    marginTop: 10,
    fontSize: 28,
    fontWeight: "800",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    gap: 12,
  },
  scanBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#101827",
    borderRadius: 22,
    padding: 14,
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
    borderLeftWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopLeftRadius: 4,
  },
  scanCornerTopRight: {
    top: 9,
    right: 9,
    borderRightWidth: 2.5,
    borderTopWidth: 2.5,
    borderTopRightRadius: 4,
  },
  scanCornerBottomLeft: {
    bottom: 9,
    left: 9,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomLeftRadius: 4,
  },
  scanCornerBottomRight: {
    bottom: 9,
    right: 9,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderBottomRightRadius: 4,
  },
  scanBannerText: {
    flex: 1,
  },
  scanBannerTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  scanBannerBody: {
    color: "#dbe2ef",
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    borderRadius: 16,
    color: "#14213d",
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#14213d",
    paddingVertical: 14,
    alignItems: "center",
  },
  cameraButton: {
    borderRadius: 999,
    backgroundColor: "#14213d",
    paddingVertical: 14,
    alignItems: "center",
  },
  cameraText: {
    color: "#fff",
    fontWeight: "800",
  },
  locationBadge: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#edf6ff",
  },
  locationBadgeText: {
    color: "#14213d",
    fontWeight: "700",
    fontSize: 13,
  },
  uploadText: {
    color: "#14213d",
    fontWeight: "700",
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 24,
  },
  submitButton: {
    backgroundColor: "#ef8354",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
