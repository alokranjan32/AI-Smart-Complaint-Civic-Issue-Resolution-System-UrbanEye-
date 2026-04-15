const users = [
  {
    id: "seed-user-1",
    name: "Aarav Singh",
    email: "citizen@urbaneye.dev",
    password: "$2b$10$9cuvx0ExNkQWXdQ2n6A0n.6M3NSpQqVQ8jQJ4x6cPX0T3CB7wWQ1K",
    role: "CITIZEN",
    createdAt: "2026-03-18T08:20:00.000Z",
  },
  {
    id: "seed-user-2",
    name: "Meera Rao",
    email: "authority@urbaneye.dev",
    password: "$2b$10$9cuvx0ExNkQWXdQ2n6A0n.6M3NSpQqVQ8jQJ4x6cPX0T3CB7wWQ1K",
    role: "AUTHORITY",
    createdAt: "2026-03-18T09:00:00.000Z",
  },
  {
    id: "seed-user-3",
    name: "Sonal Verma",
    email: "admin@urbaneye.dev",
    password: "$2b$10$9cuvx0ExNkQWXdQ2n6A0n.6M3NSpQqVQ8jQJ4x6cPX0T3CB7wWQ1K",
    role: "ADMIN",
    createdAt: "2026-03-18T09:30:00.000Z",
  },
];

const complaints = [
  {
    id: "cmp-1001",
    title: "Overflowing roadside garbage",
    description: "Garbage bins near Sector 8 market have not been cleared for three days.",
    location: "Sector 8 Market, Patna",
    category: "Sanitation",
    priority: "HIGH",
    status: "IN_PROGRESS",
    department: "Sanitation Department",
    sentiment: "frustrated",
    confidence: 0.89,
    suggestedAction: "Dispatch sanitation pickup team within 12 hours.",
    socialPost: "Ticket escalated for sanitation crew update.",
    image: "",
    latitude: 25.6175,
    longitude: 85.1452,
    upvotes: 19,
    userId: "seed-user-1",
    createdAt: "2026-03-22T09:30:00.000Z",
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
    sentiment: "concerned",
    confidence: 0.78,
    suggestedAction: "Assign to night maintenance team for inspection.",
    socialPost: "",
    image: "",
    latitude: 25.6128,
    longitude: 85.1178,
    upvotes: 11,
    userId: "seed-user-1",
    createdAt: "2026-03-21T18:10:00.000Z",
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
    sentiment: "urgent",
    confidence: 0.84,
    suggestedAction: "Inspect pipeline pressure and send repair crew.",
    socialPost: "",
    image: "",
    latitude: 25.5944,
    longitude: 85.1612,
    upvotes: 23,
    userId: "seed-user-1",
    createdAt: "2026-03-23T06:45:00.000Z",
  },
  {
    id: "cmp-1004",
    title: "Pothole causing traffic slowdown",
    description: "A deep pothole at the flyover approach is forcing bikes into traffic.",
    location: "Bailey Road Flyover, Patna",
    category: "Roads",
    priority: "HIGH",
    status: "RESOLVED",
    department: "Road Department",
    sentiment: "annoyed",
    confidence: 0.92,
    suggestedAction: "Mark area and schedule resurfacing crew.",
    socialPost: "Resolved after emergency patch work.",
    image: "",
    latitude: 25.6096,
    longitude: 85.1081,
    upvotes: 31,
    userId: "seed-user-1",
    createdAt: "2026-03-19T07:50:00.000Z",
  },
];

function decorateComplaint(complaint) {
  return {
    ...complaint,
    user: users.find((user) => user.id === complaint.userId) || null,
  };
}

export function listUsers() {
  return users.map(({ password, ...user }) => user);
}

export function getRawUsers() {
  return users;
}

export function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}

export function addUser(user) {
  users.push(user);
  return user;
}

export function listComplaints() {
  return complaints
    .map(decorateComplaint)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getComplaintById(id) {
  const complaint = complaints.find((item) => item.id === id);
  return complaint ? decorateComplaint(complaint) : null;
}

export function addComplaint(complaint) {
  complaints.unshift(complaint);
  return decorateComplaint(complaint);
}

export function getAnalytics() {
  const items = listComplaints();
  const statusBreakdown = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  const priorityBreakdown = items.reduce((acc, item) => {
    acc[item.priority] = (acc[item.priority] || 0) + 1;
    return acc;
  }, {});
  const departmentBreakdown = items.reduce((acc, item) => {
    acc[item.department] = (acc[item.department] || 0) + 1;
    return acc;
  }, {});

  return {
    totals: {
      complaints: items.length,
      pending: statusBreakdown.PENDING || 0,
      inProgress: statusBreakdown.IN_PROGRESS || 0,
      resolved: statusBreakdown.RESOLVED || 0,
      users: users.length,
    },
    statusBreakdown,
    priorityBreakdown,
    departmentBreakdown,
    recentComplaints: items.slice(0, 5),
  };
}

export function getMapHotspots() {
  return listComplaints().map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    latitude: item.latitude,
    longitude: item.longitude,
    category: item.category,
    priority: item.priority,
    status: item.status,
  }));
}
