import API from "./api";

function buildDemoUser(data) {
  return {
    id: `demo-${Date.now()}`,
    name: data.name || "Demo Citizen",
    email: data.email,
    role: "CITIZEN",
    createdAt: new Date().toISOString(),
    xHandle: "",
    alertsEnabled: false,
    alertLatitude: null,
    alertLongitude: null,
    alertRadiusKm: 3,
  };
}

export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return { user: buildDemoUser(data) };
    }

    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return { user: buildDemoUser(data) };
    }

    throw error;
  }
};
