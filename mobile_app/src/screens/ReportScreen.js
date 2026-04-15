import React, { useState } from "react";
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

import { createComplaint } from "../services/complaintService";

export default function ReportScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
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
      await createComplaint({
        title,
        description,
        location,
        image,
      });

      Alert.alert("Success", "Complaint submitted");
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
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

          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Text style={styles.uploadText}>{image ? "Change image" : "Upload image"}</Text>
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
