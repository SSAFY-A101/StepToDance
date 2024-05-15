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


export const getShortformDetail = async (shortformId) => {
  try {
    const response = await customAxios.get(`shorts/${shortformId}`, {});
    return response.data;
  } catch (error) {
    console.error("Error fetching shortform detail:", error);
    throw error;
  }
};


export const uploadShortform = async (guideId, video) => {
  try {
    const formData = new FormData();
    formData.append('guide_id', guideId);
    formData.append('video', video);

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