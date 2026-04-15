import API from "./api";

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
  try {
    const res = await API.get("/complaints");
    return res.data;
  } catch (error) {
    return demoComplaints;
  }
};

export const createComplaint = async (payload) => {
  try {
    const res = await API.post("/complaints", payload);
    return res.data;
  } catch (error) {
    return {
      id: `demo-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      category: "General",
      priority: "MEDIUM",
      status: "PENDING",
      department: "Civic Response Cell",
      suggestedAction: "Validate details and route to the appropriate department.",
    };
  }
};
