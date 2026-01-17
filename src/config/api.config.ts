import { client } from "../api/client.gen";
import { envConfig } from "./env.config";

export const APIConfig = () => {
  client.setConfig({
    baseUrl: envConfig.VITE_API_BASE_URL,
    credentials: "include",
  });

 
};