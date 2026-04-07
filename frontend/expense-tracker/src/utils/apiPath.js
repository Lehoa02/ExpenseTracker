export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

//utils/apiPath.js
export const API_PATHS = {
    AUTH: {
        LOGIN: `/auth/login`,
        REGISTER: `/auth/register`,
        GET_USER_INFO: `/auth/getUser`,
    },
    DASHBOARD: {
        GET_DATA: `/dashboard`,
        GET_PROFIT_BREAKDOWN: (monthKey) => `/dashboard/profit-breakdown?month=${encodeURIComponent(monthKey)}`,
    },
    AI: {
        CHAT: `/ai/message`,
    },
    INCOME: {
        ADD_INCOME: `/income/add`,
        GET_ALL_INCOME: `/income/get`,
        GET_SCHEDULED_INCOME: `/income/scheduled/get`,
        UPDATE_INCOME: (id) => `/income/${id}`,
        DELETE_INCOME: (id) => `/income/${id}`,
        DELETE_INCOME_BY_SOURCE: (source) => `/income/source/${encodeURIComponent(source)}`,
        DOWNLOAD_INCOME: `/income/download-excel`,
        STOP_RECURRING: (templateId) => `/income/recurring/${templateId}/stop`,
    },
    EXPENSE: {
        ADD_EXPENSE: `/expense/add`,
        GET_ALL_EXPENSE: `/expense/get`,
        GET_SCHEDULED_EXPENSE: `/expense/scheduled/get`,
        UPDATE_EXPENSE: (id) => `/expense/${id}`,
        DELETE_EXPENSE: (id) => `/expense/${id}`,
        DELETE_EXPENSE_BY_CATEGORY: (category) => `/expense/category/${encodeURIComponent(category)}`,
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