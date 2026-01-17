export const envConfig = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    API_DEFAULT_LIMIT: 10,
    API_DEFAULT_PAGE: 1,
};

export const COMPLETE_API_BASE_URL =
    envConfig.VITE_API_BASE_URL + "/api/v1";
