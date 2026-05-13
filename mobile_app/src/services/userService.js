import API from "./api";

export const updateUserProfile = async (userId, payload) => {
  try {
    const response = await API.patch(`/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    if (!error.response) {
      return {
        id: userId,
        ...payload,
      };
    }

    throw error;
  }
};
