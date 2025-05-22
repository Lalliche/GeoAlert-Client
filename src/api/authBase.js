import axios from "axios";

const authBase = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_DOMAIN_LOCAL +
    process.env.NEXT_PUBLIC_API_BASE_URL_AUTH,
});

export default authBase;
