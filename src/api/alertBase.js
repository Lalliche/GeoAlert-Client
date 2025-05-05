import axios from "axios";

const authBase = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_ALERT,
});

export default authBase;
