import axios from "axios";

export let BASE_ENDPOINT = "";

export const APP_ENVIRONMENT = "local";

if (APP_ENVIRONMENT === "local") {
  BASE_ENDPOINT = "http://localhost:4004";
} else if (APP_ENVIRONMENT === "development") {
  BASE_ENDPOINT = "http://localhost:4004";
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: true,
});
