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
    INCOME: {
        ADD_INCOME: `/income/add`,
        GET_ALL_INCOME: `/income/get`,
        DELETE_INCOME: (id) => `/income/delete/${id}`,
        DOWNLOAD_INCOME: `/income/download`,
    },
    EXPENSE: {
        ADD_EXPENSE: `/expense/add`,
        GET_ALL_EXPENSE: `/expense/get`,
        DELETE_EXPENSE: (id) => `/expense/delete/${id}`,
        DOWNLOAD_EXPENSE: `/expense/download`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/auth/upload-image`,
    },
};