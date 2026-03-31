export const BASE_URL = "http://localhost:8000/api/v1";

//utils/apiPath.js
export const API_PATHS = {
    AUTH: {
        LOGIN: `/auth/login`,
        REGISTER: `/auth/register`,
        GET_USER_INFO: `/auth/getUser`,
    },
    DASHBOARD: {
        GET_DATA: `/dashboard`,
    },
    AI: {
        CHAT: `/ai/message`,
    },
    INCOME: {
        ADD_INCOME: `/income/add`,
        GET_ALL_INCOME: `/income/get`,
        DELETE_INCOME: (id) => `/income/${id}`,
        DOWNLOAD_INCOME: `/income/download-excel`,
        STOP_RECURRING: (templateId) => `/income/recurring/${templateId}/stop`,
    },
    EXPENSE: {
        ADD_EXPENSE: `/expense/add`,
        GET_ALL_EXPENSE: `/expense/get`,
        DELETE_EXPENSE: (id) => `/expense/${id}`,
        DOWNLOAD_EXPENSE: `/expense/download-excel`,
        STOP_RECURRING: (templateId) => `/expense/recurring/${templateId}/stop`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/auth/upload-image`,
    },
    SETTINGS: {
        UPDATE_PROFILE: `/settings/update-profile`,
        CHANGE_PASSWORD: `/settings/change-password`,
    }
};