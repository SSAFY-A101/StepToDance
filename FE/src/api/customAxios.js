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

if (accessToken) {
  customAxios.defaults.headers.common["Authorization"] =
    `Bearer ` + accessToken;
}

export { customAxios };
