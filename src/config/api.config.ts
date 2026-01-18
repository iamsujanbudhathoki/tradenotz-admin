import { CustomStatusEnum } from "@/constants/appConstants";
import { client } from "../api/client.gen";
import { envConfig } from "./env.config";


const getRedirectUrl = () =>
  encodeURIComponent(
    window.location.pathname + window.location.search
  );

const redirectToLogin = () => {
  const redirect = getRedirectUrl();
  window.location.href = `/login?redirect=${redirect}`;
};



export const APIConfig = () => {
  client.setConfig({
    baseUrl: envConfig.VITE_API_BASE_URL,
    credentials: "include",
  });


};

/* ---------- REQUEST INTERCEPTOR ---------- */
client.interceptors.request.use(async (request: Request) => {
  const cloned = request.clone();
  const bodyText =
    cloned.method !== "GET" && cloned.method !== "HEAD"
      ? await cloned.text()
      : undefined;

  (request as any).__originalRequest = {
    url: cloned.url,
    method: cloned.method,
    headers: Array.from(cloned.headers.entries()),
    body: bodyText,
    credentials: cloned.credentials,
  };

  return request;
});

/* ---------- RESPONSE INTERCEPTOR ---------- */
client.interceptors.response.use(async (response: Response) => {
  const contentType = response.headers.get("content-type");

  // Skip binary responses
  if (
    contentType?.includes("application/pdf") ||
    contentType?.includes("application/octet-stream") ||
    contentType?.includes("image/") ||
    contentType?.includes("video/") ||
    contentType?.includes("audio/")
  ) {
    return response;
  }

  const clonedResponse = response.clone();

  try {
    const data = await clonedResponse.json();
    const status = data?.status as string;

    /* ---------- LOGIN SUCCESS ---------- */
    if (status === CustomStatusEnum.LOGIN_SUCCESS) {
      if (data?.data?.accessToken) {
        localStorage.setItem("token", data.data.accessToken);
      }

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      window.location.href = redirect
        ? decodeURIComponent(redirect)
        : "/dashboard";

      return response;
    }
    if (status === CustomStatusEnum.TOKEN_NOT_FOUND) {
      localStorage.removeItem("token");
      redirectToLogin();
      return response;
    }

    /* ---------- EMAIL NOT VERIFIED ---------- */
    if (status === CustomStatusEnum.EMAIL_NOT_VERIFIED) {
      const email = data?.data?.user?.email;
      window.location.href = email
        ? `/verify-email?email=${encodeURIComponent(email)}`
        : "/verify-email";
      return response;
    }

    /* ---------- TOKEN EXPIRED ---------- */

  } catch {
    return response;
  }

  return response;
});
