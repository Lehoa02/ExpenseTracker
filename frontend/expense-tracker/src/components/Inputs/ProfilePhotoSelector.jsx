import React, { useRef, useState } from "react";
import {LuUser, LuUpload, LuTrash} from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
    const inputRef =useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            //Update the image state with the selected file
            setImage(file);

            //Generate a preview URL for the selected image
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };
    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };
    const onChooseFile = () => {
    inputRef.current.click();
    }

    return(<div className="flex justify-center">
        <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            className="hidden"
            />
        {!image ? (
            <div className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-violet-300 bg-violet-50/90 shadow-sm dark:border-violet-500/30 dark:bg-violet-500/10">
                <LuUser className="text-2xl text-primary" />

                <button 
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-105"
                    type="button"
                    onClick={onChooseFile}
                >
                <LuUpload size={12} />
                </button>
            </div>
        ) : (
            <div className="relative">
                <img
                    src={previewUrl}
                    alt="Profile Photo"
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-md dark:ring-slate-900"
                />
                <button
                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20 transition-transform hover:scale-105"
                    type="button"
                    onClick={handleRemoveImage}
                >
                    <LuTrash size={12} />
                </button>
            </div>
        )}

        </div>
    )
}

export default ProfilePhotoSelector