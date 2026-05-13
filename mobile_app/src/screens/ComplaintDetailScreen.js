import React, { useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { getPriorityMeta, getResolutionMessage, getStatusMeta } from "../utils/complaintUtils";
import { getComplaintById } from "../services/complaintService";

export default function ComplaintDetailScreen({ route }) {
  const { item } = route.params;
  const [complaint, setComplaint] = useState(item);

  useEffect(() => {
    let isMounted = true;

    const loadComplaint = async () => {
      const detailedComplaint = await getComplaintById(item.id);

      if (isMounted && detailedComplaint) {
        setComplaint(detailedComplaint);
      }
    };

    loadComplaint();

    return () => {
      isMounted = false;
    };
  }, [item.id]);

  const statusMeta = getStatusMeta(complaint.status);
  const priorityMeta = getPriorityMeta(complaint.priority);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
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
          <Text style={styles.category}>{complaint.category}</Text>
          <Text style={styles.title}>{complaint.title || complaint.description}</Text>
          <Text style={styles.heroDescription}>{complaint.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolution status</Text>
          <Text style={styles.resolutionBody}>{getResolutionMessage(complaint.status)}</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Priority</Text>
              <Text
                style={[
                  styles.detailValue,
                  { color: priorityMeta.textColor },
                ]}
              >
                {priorityMeta.label}
              </Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{complaint.department || "Civic Response Cell"}</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{complaint.location}</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Current state</Text>
              <Text style={styles.detailValue}>{statusMeta.shortLabel}</Text>
            </View>
          </View>
        </View>

        {complaint.assignedTo ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned desk</Text>
            <Text style={styles.resolutionBody}>{complaint.assignedTo}</Text>
            {complaint.adminNote ? <Text style={styles.sectionBody}>{complaint.adminNote}</Text> : null}
          </View>
        ) : null}

        {(complaint.history || []).length ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complaint timeline</Text>
            <View style={styles.timelineList}>
              {[...(complaint.history || [])]
                .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
                .map((entry) => (
                  <View key={entry.id} style={styles.timelineCard}>
                    <View style={styles.timelineTopRow}>
                      <Text style={styles.timelineActor}>
                        {entry.actorName} • {entry.actorRole}
                      </Text>
                      <Text style={styles.timelineType}>{entry.type.replace("_", " ")}</Text>
                    </View>
                    <Text style={styles.timelineMessage}>{entry.message}</Text>
                    {entry.note ? <Text style={styles.timelineNote}>{entry.note}</Text> : null}
                    <Text style={styles.timelineTime}>
                      {new Date(entry.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        ) : null}

        {complaint.suggestedAction ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Action</Text>
            <Text style={styles.sectionBody}>{complaint.suggestedAction}</Text>
          </View>
        ) : null}

        {complaint.image ? <Image source={{ uri: complaint.image }} style={styles.image} /> : null}

        {complaint.socialPost ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Update</Text>
            <Text style={styles.sectionBody}>{complaint.socialPost}</Text>
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
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
  },
  category: {
    color: "#ef8354",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 14,
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
  heroDescription: {
    marginTop: 10,
    color: "#dbe2ef",
    lineHeight: 22,
  },
  sectionBody: {
    color: "#4f5d75",
    lineHeight: 22,
    marginTop: 10,
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
  resolutionBody: {
    color: "#4f5d75",
    lineHeight: 22,
  },
  detailGrid: {
    gap: 12,
    marginTop: 14,
  },
  detailCard: {
    backgroundColor: "#f9f4ec",
    borderRadius: 18,
    padding: 16,
  },
  timelineList: {
    gap: 12,
  },
  timelineCard: {
    backgroundColor: "#f9f4ec",
    borderRadius: 18,
    padding: 16,
  },
  timelineTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  timelineActor: {
    color: "#14213d",
    fontWeight: "700",
    flex: 1,
  },
  timelineType: {
    color: "#7b8794",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  timelineMessage: {
    color: "#4f5d75",
    lineHeight: 21,
    marginTop: 10,
  },
  timelineNote: {
    color: "#14213d",
    lineHeight: 21,
    marginTop: 10,
    fontWeight: "600",
  },
  timelineTime: {
    color: "#7b8794",
    fontSize: 12,
    marginTop: 10,
  },
  detailLabel: {
    color: "#7b8794",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  detailValue: {
    color: "#14213d",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 24,
  },
});
