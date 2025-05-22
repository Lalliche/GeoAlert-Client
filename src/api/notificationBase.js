import axios from "axios";

const noticationBase = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_DOMAIN_LOCAL +
    process.env.NEXT_PUBLIC_API_BASE_URL_NOTIFICATION,
});

export default noticationBase;
