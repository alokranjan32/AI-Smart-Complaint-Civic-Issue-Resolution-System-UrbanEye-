import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";

import { AuthContext } from "../context/AuthContext";
import { updateUserProfile } from "../services/userService";

export default function ProfileScreen() {
  const { updateUser, user, setUser } = useContext(AuthContext);
  const [xHandle, setXHandle] = useState(user?.xHandle || "");
  const [alertRadiusKm, setAlertRadiusKm] = useState(String(user?.alertRadiusKm || 3));
  const [locationLabel, setLocationLabel] = useState(
    user?.alertLatitude && user?.alertLongitude
      ? `${Number(user.alertLatitude).toFixed(4)}, ${Number(user.alertLongitude).toFixed(4)}`
      : "No alert location saved",
  );
  const [savingLocation, setSavingLocation] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setXHandle(user?.xHandle || "");
    setAlertRadiusKm(String(user?.alertRadiusKm || 3));
    setLocationLabel(
      user?.alertLatitude && user?.alertLongitude
        ? `${Number(user.alertLatitude).toFixed(4)}, ${Number(user.alertLongitude).toFixed(4)}`
        : "No alert location saved",
    );
  }, [user?.alertLatitude, user?.alertLongitude, user?.alertRadiusKm, user?.xHandle]);

  const syncProfile = async (updates) => {
    if (!user?.id) {
      updateUser(updates);
      return;
    }

    const persistedUser = await updateUserProfile(user.id, updates);
    updateUser(persistedUser);
  };

  const handleSaveXAccount = async () => {
    const normalizedHandle = xHandle.replace(/^@+/, "").trim();
    const normalizedRadius = Math.max(1, Number(alertRadiusKm) || 3);

    if (!normalizedHandle && !user?.alertLatitude) {
      setMessage("Enter an X username to save the account.");
      return;
    }

    if (normalizedHandle && !/^[A-Za-z0-9_]{1,15}$/.test(normalizedHandle)) {
      setMessage("Use a valid X handle with letters, numbers, or underscores only.");
      return;
    }

    await syncProfile({
      xHandle: normalizedHandle,
      alertRadiusKm: normalizedRadius,
      alertsEnabled: Boolean(user?.alertLatitude && user?.alertLongitude),
    });
    setXHandle(normalizedHandle);
    setAlertRadiusKm(String(normalizedRadius));
    setMessage(
      normalizedHandle
        ? `Profile updated. X account saved as @${normalizedHandle}.`
        : "Alert preferences updated.",
    );
  };

  const handleRemoveXAccount = async () => {
    await syncProfile({ xHandle: "" });
    setXHandle("");
    setMessage("Saved X account removed.");
  };

  const handleUseCurrentLocation = async () => {
    try {
      setSavingLocation(true);
      setMessage("");
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert("Permission needed", "Allow location access to enable nearby hazard warnings.");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const normalizedRadius = Math.max(1, Number(alertRadiusKm) || 3);
      const updates = {
        alertsEnabled: true,
        alertLatitude: position.coords.latitude,
        alertLongitude: position.coords.longitude,
        alertRadiusKm: normalizedRadius,
      };

      await syncProfile(updates);
      setLocationLabel(
        `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
      );
      setAlertRadiusKm(String(normalizedRadius));
      setMessage("Nearby hazard alerts are now tied to your current location.");
    } catch (error) {
      Alert.alert("Location unavailable", "Unable to capture your current location right now.");
    } finally {
      setSavingLocation(false);
    }
  };

  const handleDisableAlerts = async () => {
    await syncProfile({ alertsEnabled: false });
    setMessage("Nearby hazard alerts disabled.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Profile</Text>
          <Text style={styles.name}>{user?.name || "Citizen"}</Text>
          <Text style={styles.email}>{user?.email || "citizen@urbaneye.dev"}</Text>

          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaCard}>
              <Text style={styles.heroMetaValue}>{user?.role || "CITIZEN"}</Text>
              <Text style={styles.heroMetaLabel}>Role</Text>
            </View>
            <View style={styles.heroMetaCard}>
              <Text style={styles.heroMetaValue}>{user?.alertsEnabled ? "Enabled" : "Off"}</Text>
              <Text style={styles.heroMetaLabel}>Hazard alerts</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>X account</Text>

          <View style={styles.handleInputShell}>
            <Text style={styles.handlePrefix}>@</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="your_handle"
              placeholderTextColor="#9aa4b2"
              style={styles.handleInput}
              value={xHandle}
              onChangeText={(value) => {
                setMessage("");
                setXHandle(value.replace(/^@+/, ""));
              }}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveXAccount}>
            <Text style={styles.primaryButtonText}>{user?.xHandle ? "Update X account" : "Save X account"}</Text>
          </TouchableOpacity>

          {user?.xHandle ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRemoveXAccount}>
              <Text style={styles.secondaryButtonText}>Remove X account</Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.connectedText}>
            {user?.xHandle ? `Connected: @${user.xHandle}` : "No X account saved."}
          </Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Nearby alerts</Text>

          <View style={styles.locationCard}>
            <Text style={styles.locationLabel}>Alert location</Text>
            <Text style={styles.locationValue}>{locationLabel}</Text>
          </View>

          <Text style={styles.smallLabel}>Radius in km</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor="#9aa4b2"
            style={styles.radiusInput}
            value={alertRadiusKm}
            onChangeText={(value) => {
              setMessage("");
              setAlertRadiusKm(value);
            }}
          />

          <TouchableOpacity style={styles.primaryButton} onPress={handleUseCurrentLocation} disabled={savingLocation}>
            <Text style={styles.primaryButtonText}>
              {savingLocation ? "Capturing..." : "Use current location"}
            </Text>
          </TouchableOpacity>

          {user?.alertsEnabled ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleDisableAlerts}>
              <Text style={styles.secondaryButtonText}>Disable nearby hazard alerts</Text>
            </TouchableOpacity>
          ) : null}

          <Text style={styles.connectedText}>
            {user?.alertsEnabled
              ? `Nearby warnings enabled within ${user?.alertRadiusKm || alertRadiusKm} km.`
              : "Nearby warnings are currently off."}
          </Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => setUser(null)}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4efe6",
  },
  container: {
    padding: 20,
    gap: 14,
  },
  hero: {
    backgroundColor: "#14213d",
    borderRadius: 24,
    padding: 22,
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
  heroMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  heroMetaCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 14,
  },
  heroMetaValue: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  heroMetaLabel: {
    color: "#dbe2ef",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e7dccd",
  },
  cardLabel: {
    color: "#6b7280",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontWeight: "700",
  },
  smallLabel: {
    marginTop: 14,
    color: "#6b7280",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "800",
  },
  cardValue: {
    color: "#14213d",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  cardDescription: {
    color: "#5c677d",
    lineHeight: 22,
    marginTop: 10,
  },
  locationCard: {
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: "#fcfaf6",
    borderWidth: 1,
    borderColor: "#ebe3d6",
    padding: 14,
  },
  locationLabel: {
    color: "#7b8794",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  locationValue: {
    marginTop: 8,
    color: "#14213d",
    fontWeight: "700",
  },
  radiusInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    borderRadius: 16,
    color: "#14213d",
    backgroundColor: "#fcfaf6",
  },
  handleInputShell: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    backgroundColor: "#fcfaf6",
  },
  handlePrefix: {
    paddingLeft: 16,
    color: "#14213d",
    fontSize: 18,
    fontWeight: "800",
  },
  handleInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    color: "#14213d",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d8dde6",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4f5d75",
    fontWeight: "700",
  },
  connectedText: {
    marginTop: 14,
    color: "#14213d",
    fontWeight: "700",
  },
  message: {
    marginTop: 8,
    color: "#5c677d",
    lineHeight: 20,
  },
  logoutButton: {
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
