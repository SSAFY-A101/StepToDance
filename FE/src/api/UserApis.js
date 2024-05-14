import { customAxios } from "./customAxios";

export const getUserDatas = async (limit, offset) => {
  try {
    const response = await customAxios.get(`users?limit=${limit}&offset=${offset}`, {});
    return response.data;
  } catch (error) {
    console.log("Error fetching feedback detail:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
    try {
        const response = await customAxios.get(`users/${userId}`, {});
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}