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
] = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzE1NTU5OTAyNDExLCJpZCI6NCwiZXhwaXJlc0luIjoyNTkyMDAwMDAwLCJhdXRoIjoiQVVUSE9SSVRZIiwiZXhwIjoxNzE4MTUxOTAyfQ.Jzxuz-tI-ChOfupC1XdjE-gLgOC0BuTnTNQQ9HbHdTs`;

// if (accessToken) {
//   customAxios.defaults.headers.common["Authorization"] =
//     `Bearer ` + accessToken;
// }

export { customAxios };
