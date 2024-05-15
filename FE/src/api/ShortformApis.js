import { customAxios } from "./customAxios";

export const getShortformList = async (page) => {
  try {
    const response = await customAxios.get(`shorts/list/${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shortform list:", error);
    throw error;
  }
};

// 유저별 조회
export const getUserShortform = async (userId) => {
  try {
    const response = await customAxios.get(`shorts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching shortform with userId:", error);
    throw error;
  }
};

// 상세 조회
export const getShortformDetail = async (shortformId) => {
  try {
    const response = await customAxios.get(`shorts/${shortformId}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching shortform detail:", error);
    throw error;
  }
};

// 숏폼 업로드
export const uploadShortform = async (guideId, videoUrl, startAt, endAt) => {
  try {
    const formData = new FormData();
    formData.append('guide_id', guideId);
    formData.append('video_url', videoUrl);
    formData.append('startAt', startAt);
    formData.append('endAt', endAt);

    const response = await customAxios.post(`shorts/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading shortform:', error);
    throw error;
  }
};

export const deleteShortform = async (shortformId) => {
  try {
    const response = await customAxios.delete(`shorts/${shortformId}`);
    return response.data;
  } catch (error) {
    console.log('Error deleting shortform:', error);
  }
}