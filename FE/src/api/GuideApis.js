import { customAxios } from "./customAxios";

export const getGuideList = async (keyword) => {
  try {
    const response = await customAxios.get(`guides?limit=10&offset=1&title=&singer=&category=${keyword}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching guide list:", error);
    throw error;
  }
};

export const guideUpload = async (formData) => {
  delete customAxios.defaults.headers["Content-Type"];
  try {
    const response = await customAxios.post(`guides/file`, formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching guide list:", error);
    throw error;
  }
};

export const guideResult = async (guideId,formData) => {
  delete customAxios.defaults.headers["Content-Type"];
  try {
    const response = await customAxios.post(`guides/${guideId}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error fetching guide list:", error);
    throw error;
  }
};

export const getHotGuideList = async () => {
  try {
    const response = await customAxios.get(`guides/hot-guide`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching guide list:", error);
    throw error;
  }
};

export const getGuideDetail = async (guideId) => {
  try {
    const response = await customAxios.get(`guides/${guideId}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching guide detail:", error);
    throw error;
  }
};

export const searchGuide = async (keyword) => {
  try {
    const response = await customAxios.get(
      `guides?limit=10&offset=1&title=${keyword}&singer=${keyword}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching guide list:", error);
    throw error;
  }
};

export const postFeedback = async (guideId, feedbackData) => {
  try {
    const response = await customAxios.post(
      `guides/${guideId}/feedback`,
      feedbackData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting feedback:", error);
    throw error;
  }
};

export const uploadGuide = async (
  songName,
  singer,
  highlightStartAt,
  highlightEndAt,
  video
) => {
  try {
    const formData = new FormData();
    formData.append("song_name", songName);
    formData.append("singer", singer);
    formData.append("highlight_section_start_at", highlightStartAt);
    formData.append("highlight_section_end_at", highlightEndAt);
    formData.append("video", video);

    const response = await customAxios.post(`guides/file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading guide:", error);
    throw error;
  }
};
