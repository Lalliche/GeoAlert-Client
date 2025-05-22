import axios from "axios";

const alertBase = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_DOMAIN_LOCAL +
    process.env.NEXT_PUBLIC_API_BASE_URL_ALERT,
});

export default alertBase;
