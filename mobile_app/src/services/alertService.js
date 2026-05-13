import API from "./api";

const demoAlerts = [
  {
    id: "alert-cmp-1002",
    complaintId: "cmp-1002",
    title: "Streetlight outage",
    message: "Electricity hazard reported near Boring Road Crossing, Patna.",
    category: "Electricity",
    severity: "MEDIUM",
    distanceKm: 0.6,
    hazardRadiusKm: 3,
    location: "Boring Road Crossing, Patna",
    status: "PENDING",
  },
  {
    id: "alert-cmp-1003",
    complaintId: "cmp-1003",
    title: "Water leakage near bus stop",
    message: "Water hazard reported near Kankarbagh Main Road, Patna.",
    category: "Water",
    severity: "HIGH",
    distanceKm: 1.2,
    hazardRadiusKm: 3,
    location: "Kankarbagh Main Road, Patna",
    status: "PENDING",
  },
];

export const getNearbyAlerts = async ({ latitude, longitude, radiusKm = 3 }) => {
  try {
    const response = await API.get("/alerts/nearby", {
      params: { latitude, longitude, radiusKm },
    });
    return response.data;
  } catch (error) {
    return demoAlerts;
  }
};

export const getUserAlerts = async (userId) => {
  try {
    const response = await API.get(`/alerts/user/${userId}`);
    return response.data;
  } catch (error) {
    return demoAlerts;
  }
};
