export type User = {
  id?: string;
  name: string;
  email: string;
  role?: string;
};

export type Complaint = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  status: string;
  department?: string;
  sentiment?: string;
  confidence?: number;
  suggestedAction?: string;
  createdAt: string;
  socialPost?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  upvotes?: number;
  assignedTo?: string;
  adminNote?: string;
  updatedAt?: string;
  history?: ComplaintHistoryEntry[];
  user?: User | null;
};

export type ComplaintHistoryEntry = {
  id: string;
  complaintId: string;
  type: string;
  actorName: string;
  actorRole: string;
  message: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  department?: string;
  assignedTo?: string;
  note?: string;
  createdAt: string;
};

export type AdminOverview = {
  totals: {
    complaints: number;
    pending: number;
    inProgress: number;
    resolved: number;
    users: number;
  };
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  departmentBreakdown: Record<string, number>;
  recentComplaints: Complaint[];
};

export const demoComplaints: Complaint[] = [
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
    createdAt: "2026-03-22T09:30:00.000Z",
    socialPost: "Ticket escalated for sanitation crew update.",
    upvotes: 19,
    latitude: 25.6175,
    longitude: 85.1452,
    assignedTo: "Ward Sanitation Officer",
    adminNote: "Crew dispatched for same-day pickup and route inspection.",
    updatedAt: "2026-03-22T13:15:00.000Z",
    user: {
      name: "Aarav Singh",
      email: "citizen@urbaneye.dev",
      role: "CITIZEN",
    },
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
    createdAt: "2026-03-21T18:10:00.000Z",
    upvotes: 11,
    latitude: 25.6128,
    longitude: 85.1178,
    assignedTo: "Electrical Maintenance Desk",
    adminNote: "Awaiting field technician assignment for night inspection.",
    updatedAt: "2026-03-21T18:10:00.000Z",
    user: {
      name: "Aarav Singh",
      email: "citizen@urbaneye.dev",
      role: "CITIZEN",
    },
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
    createdAt: "2026-03-23T06:45:00.000Z",
    upvotes: 23,
    latitude: 25.5944,
    longitude: 85.1612,
    updatedAt: "2026-03-23T06:45:00.000Z",
    user: {
      name: "Aarav Singh",
      email: "citizen@urbaneye.dev",
      role: "CITIZEN",
    },
  },
  {
    id: "cmp-1004",
    title: "Pothole causing traffic slowdown",
    description: "A deep pothole has opened up at the flyover approach and bikes are swerving around it.",
    location: "Bailey Road Flyover, Patna",
    category: "Roads",
    priority: "HIGH",
    status: "RESOLVED",
    department: "Road Department",
    sentiment: "annoyed",
    confidence: 0.92,
    suggestedAction: "Mark area and schedule resurfacing crew.",
    createdAt: "2026-03-19T07:50:00.000Z",
    socialPost: "Resolved after emergency patch work.",
    upvotes: 31,
    latitude: 25.6096,
    longitude: 85.1081,
    assignedTo: "Road Repair Cell",
    adminNote: "Temporary resurfacing completed and site marked for follow-up audit.",
    updatedAt: "2026-03-19T17:35:00.000Z",
    user: {
      name: "Aarav Singh",
      email: "citizen@urbaneye.dev",
      role: "CITIZEN",
    },
  },
];

export const demoOverview: AdminOverview = {
  totals: {
    complaints: demoComplaints.length,
    pending: 2,
    inProgress: 1,
    resolved: 1,
    users: 3,
  },
  statusBreakdown: {
    PENDING: 2,
    IN_PROGRESS: 1,
    RESOLVED: 1,
  },
  priorityBreakdown: {
    HIGH: 3,
    MEDIUM: 1,
  },
  departmentBreakdown: {
    "Sanitation Department": 1,
    "Electricity Department": 1,
    "Water Department": 1,
    "Road Department": 1,
  },
  recentComplaints: demoComplaints.slice(0, 3),
};
