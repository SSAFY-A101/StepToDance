import { customAxios } from "./customAxios";

export const getRanking = async () => {
  try {
    const response = await customAxios.get(`users/rank`);
    return response.data;
  } catch (error) {
    console.log("Ranking 조회 실패", error);
    throw error;
  }
};
