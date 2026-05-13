import AsyncStorage from "@react-native-async-storage/async-storage";

import API from "./api";

const LOCAL_COMPLAINTS_KEY = "urbaneye-local-complaints";

function buildFallbackSocialPost(payload) {
  return `Civic update: ${payload.title} at ${payload.location}. ${payload.description} #CityUpdate #CivicAction`;
}

async function loadLocalComplaints() {
  try {
    const rawComplaints = await AsyncStorage.getItem(LOCAL_COMPLAINTS_KEY);
    return rawComplaints ? JSON.parse(rawComplaints) : [];
  } catch (error) {
    return [];
  }
}

async function saveLocalComplaints(complaints) {
  try {
    await AsyncStorage.setItem(LOCAL_COMPLAINTS_KEY, JSON.stringify(complaints));
  } catch (error) {
    // Keep the app responsive even if local persistence fails.
  }
}

function mergeComplaints(primaryComplaints, secondaryComplaints = []) {
  const seenIds = new Set();
  const combined = [...primaryComplaints, ...secondaryComplaints].filter((complaint) => {
    if (seenIds.has(complaint.id)) {
      return false;
    }

    seenIds.add(complaint.id);
    return true;
  });

  return combined.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
}

async function persistComplaint(complaint) {
  const currentComplaints = await loadLocalComplaints();
  const updatedComplaints = mergeComplaints([complaint], currentComplaints);
  await saveLocalComplaints(updatedComplaints);
}

const demoComplaints = [
  {
    id: "cmp-1001",
    title: "Overflowing roadside garbage",
    description: "Garbage bins near Sector 8 market have not been cleared for three days.",
    location: "Sector 8 Market, Patna",
    category: "Sanitation",
    priority: "HIGH",
    status: "IN_PROGRESS",
    department: "Sanitation Department",
    suggestedAction: "Dispatch sanitation pickup team within 12 hours.",
    socialPost: "Ticket escalated for sanitation crew update.",
    latitude: 25.6175,
    longitude: 85.1452,
    assignedTo: "Ward Sanitation Officer",
    adminNote: "Crew dispatched for same-day pickup and route inspection.",
    history: [
      {
        id: "cmp-1001-history-1",
        type: "CREATED",
        actorName: "Aarav Singh",
        actorRole: "CITIZEN",
        message: "Complaint submitted and routed for AI triage.",
        toStatus: "PENDING",
        createdAt: "2026-03-22T09:30:00.000Z",
      },
      {
        id: "cmp-1001-history-2",
        type: "ASSIGNED",
        actorName: "Sonal Verma",
        actorRole: "ADMIN",
        message: "Complaint assigned to Ward Sanitation Officer.",
        toStatus: "IN_PROGRESS",
        note: "Crew dispatched for same-day pickup and route inspection.",
        createdAt: "2026-03-22T13:15:00.000Z",
      },
    ],
  },
  {
    id: "cmp-1002",
    title: "Streetlight outage",
    description: "Two consecutive streetlights are out near the school crossing.",
    location: "Boring Road Crossing, Patna",
    category: "Electricity",
    priority: "MEDIUM",
    status: "PENDING",
    department: "Electricity Department",
    suggestedAction: "Assign to night maintenance team for inspection.",
    socialPost: "",
    latitude: 25.6128,
    longitude: 85.1178,
    assignedTo: "Electrical Maintenance Desk",
    adminNote: "Awaiting field technician assignment for night inspection.",
  },
  {
    id: "cmp-1003",
    title: "Water leakage near bus stop",
    description: "Continuous water leakage is flooding the footpath near the bus stop.",
    location: "Kankarbagh Main Road, Patna",
    category: "Water",
    priority: "HIGH",
    status: "PENDING",
    department: "Water Department",
    suggestedAction: "Inspect pipeline pressure and send repair crew.",
    socialPost: "",
    latitude: 25.5944,
    longitude: 85.1612,
  },
];

export const getComplaints = async () => {
  const localComplaints = await loadLocalComplaints();

  try {
    const res = await API.get("/complaints");
    return mergeComplaints(res.data, localComplaints);
  } catch (error) {
    return mergeComplaints(localComplaints, demoComplaints);
  }
};

export const createComplaint = async (payload) => {
  try {
    const res = await API.post("/complaints", payload);
    await persistComplaint(res.data);
    return res.data;
  } catch (error) {
    const complaint = {
      id: `demo-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      category: "General",
      priority: "MEDIUM",
      status: "PENDING",
      department: "Civic Response Cell",
      suggestedAction: "Validate details and route to the appropriate department.",
      socialPost: buildFallbackSocialPost(payload),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      latitude: payload.latitude,
      longitude: payload.longitude,
      history: [
        {
          id: `history-${Date.now()}`,
          type: "CREATED",
          actorName: "Citizen",
          actorRole: "CITIZEN",
          message: "Complaint submitted and routed for AI triage.",
          toStatus: "PENDING",
          createdAt: new Date().toISOString(),
        },
      ],
    };

    await persistComplaint(complaint);
    return complaint;
  }
};

export const getComplaintById = async (id) => {
  const localComplaints = await loadLocalComplaints();

  try {
    const res = await API.get(`/complaints/${id}`);
    const mergedComplaint =
      localComplaints.find((complaint) => complaint.id === id) && !res.data.history?.length
        ? {
            ...res.data,
            history: localComplaints.find((complaint) => complaint.id === id)?.history || [],
          }
        : res.data;

    await persistComplaint(mergedComplaint);
    return mergedComplaint;
  } catch (error) {
    return (
      localComplaints.find((complaint) => complaint.id === id) ||
      demoComplaints.find((complaint) => complaint.id === id) ||
      null
    );
  }
};
