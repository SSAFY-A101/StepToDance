import axios from "axios";
import { getCookie } from "../cookie";

const BASE_RUL = "https://k10a101.p.ssafy.io/api/v1/";

const accessToken = getCookie("accessToken");

const customAxios = axios.create({
  baseURL: `${BASE_RUL}`, // 기본 서버 주소 입력
  headers: {
    "Content-Type": "application/json",
  },
});
customAxios.defaults.headers.common[
  "Authorization"
] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzE1NjcxNjc0NzM5LCJpZCI6MiwiZXhwaXJlc0luIjoyNTkyMDAwMDAwLCJhdXRoIjoiQVVUSE9SSVRZIiwiZXhwIjoxNzE4MjYzNjc0fQ.lpA4fIBAkBKrxUA6HoVYiZSw3a4NvaLiblXpLsCilbk`;

// if (accessToken) {
//   customAxios.defaults.headers.common["Authorization"] =
//     `Bearer ` + accessToken;
// }

export { customAxios };
