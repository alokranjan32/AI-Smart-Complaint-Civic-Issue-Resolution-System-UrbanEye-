import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ComplaintDetailScreen({ route }) {
  const { item } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.title}>{item.title || item.description}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Routing Summary</Text>
          <Text style={styles.detail}>Priority: {item.priority}</Text>
          <Text style={styles.detail}>Status: {item.status}</Text>
          <Text style={styles.detail}>Department: {item.department || "Civic Response Cell"}</Text>
          <Text style={styles.detail}>Location: {item.location}</Text>
        </View>

        {item.suggestedAction ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Action</Text>
            <Text style={styles.description}>{item.suggestedAction}</Text>
          </View>
        ) : null}

        {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : null}

        {item.socialPost ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Update</Text>
            <Text style={styles.description}>{item.socialPost}</Text>
          </View>
        ) : null}
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
    padding: 16,
    gap: 16,
  },
  hero: {
    backgroundColor: "#14213d",
    borderRadius: 28,
    padding: 22,
  },
  category: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    color: "#fff",
    marginTop: 10,
    fontSize: 26,
    fontWeight: "800",
  },
  description: {
    marginTop: 10,
    color: "#dbe2ef",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
  },
  sectionTitle: {
    color: "#14213d",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  detail: {
    color: "#4f5d75",
    lineHeight: 22,
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 24,
  },
});
