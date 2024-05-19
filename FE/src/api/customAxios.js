import axios from "axios";
import { getCookie } from "../cookie";

const BASE_RUL = "https://www.steptodance.site/api/v1/";

const accessToken = getCookie("accessToken");

const customAxios = axios.create({
  baseURL: `${BASE_RUL}`, // 기본 서버 주소 입력
  headers: {
    "Content-Type": "application/json",
  },
});
customAxios.defaults.headers.common[
  "Authorization"
] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzE2MTEwOTc3MDA0LCJpZCI6OCwiZXhwaXJlc0luIjoyNTkyMDAwMDAwLCJhdXRoIjoiQVVUSE9SSVRZIiwiZXhwIjoxNzE4NzAyOTc3fQ.3qaW7vlvvK7T2ZDisBC5kY72hk-DvK_RwPwaOYhH_8I`;

// if (accessToken) {
//   customAxios.defaults.headers.common["Authorization"] =
//     `Bearer ` + accessToken;
// }

export { customAxios };
