import { customAxios } from "./customAxios";

export const getFeedbackDetail = async (feedbackId) => {
  try {
    const response = await customAxios.get(`feedbacks/${feedbackId}`, {});
    return response.data;
  } catch (error) {
    console.log("Error fetching feedback detail:", error);
    throw error;
  }
};

export const deleteFeedback = async (feedbackId) => {
  try {
    const response = await customAxios.delete(`feedbacks/${feedbackId}`, {});
    return response.data;
  } catch (error) {
    console.log("Error deleting feedback:", error);
    throw error;
  }
};
