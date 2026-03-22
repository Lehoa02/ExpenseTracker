import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const forrmData = new FormData();
    //Append image file to form data
    forrmData.append("image", imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, forrmData, {
            headers: {
                "Content-Type": "multipart/form-data", //Set header for file upload
            },
        });
        return response.data; //Assuming the API returns { imageUrl: "url_of_uploaded_image" }
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

export default uploadImage;