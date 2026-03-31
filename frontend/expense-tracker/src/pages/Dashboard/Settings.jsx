import React, { useContext, useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import CharAvatar from '../../components/Cards/CharAvatar';
import Input from '../../components/Inputs/Input';
import { LuTrash2, LuUpload } from 'react-icons/lu';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { toast } from 'react-hot-toast';
import { validatePassword } from '../../utils/helper';

const Settings = () => {
  useUserAuth();

  const { user, updateUser } = useContext(UserContext);
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFullName(user.fullName || '');
    setPhotoPreview(user.profilePhoto || '');
    setProfileImage(null);
    setPhotoRemoved(false);
  }, [user]);

  useEffect(() => {
    return () => {
      if (photoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfileImage(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoRemoved(false);
    event.target.value = '';
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setPhotoPreview('');
    setPhotoRemoved(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fullName.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsSaving(true);

    try {
      let profilePhoto = user?.profilePhoto || '';

      if (profileImage) {
        const uploadResponse = await uploadImage(profileImage);
        profilePhoto = uploadResponse.imageUrl || '';
      } else if (photoRemoved) {
        profilePhoto = '';
      }

      const response = await axiosInstance.put(API_PATHS.SETTINGS.UPDATE_PROFILE, {
        fullName: fullName.trim(),
        profilePhoto,
      });

      if (response.data?.user) {
        updateUser(response.data.user);
        setPhotoPreview(response.data.user.profilePhoto || '');
      }

      setProfileImage(null);
      setPhotoRemoved(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      await axiosInstance.put(API_PATHS.SETTINGS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const showPreviewImage = Boolean(photoPreview);

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="my-5 mx-auto max-w-5xl px-1 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-black dark:text-slate-100">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
            Update your display name and profile photo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
            <div className="flex flex-col items-center text-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="relative flex items-center justify-center">
                {showPreviewImage ? (
                  <img
                    src={photoPreview}
                    alt="Profile preview"
                    className="w-40 h-40 rounded-full object-cover ring-4 ring-gray-200 dark:ring-slate-700"
                  />
                ) : (
                  <CharAvatar
                    fullName={fullName || user?.fullName}
                    width="w-40"
                    height="h-40"
                    style="text-4xl"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="theme-toggle-btn"
                >
                  <LuUpload />
                  Upload photo
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="theme-toggle-btn"
                  disabled={!showPreviewImage && !user?.profilePhoto}
                >
                  <LuTrash2 />
                  Remove
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-slate-400 max-w-xs">
                JPG, PNG, or GIF. The new image is uploaded when you save.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder="Your name"
                label="Full Name"
                type="text"
              />

              <div>
                <label className="text-[13px] text-slate-800 dark:text-slate-200">Email Address</label>
                <div className="input-box opacity-75">
                  <input
                    type="text"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-transparent outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
                  Email is read-only on this screen.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <form onSubmit={handlePasswordChange} className="card mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-black dark:text-slate-100">Change Password</h2>
            <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
              Use a strong password with at least 8 characters, uppercase, lowercase, a number, and a special character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              value={currentPassword}
              onChange={({ target }) => setCurrentPassword(target.value)}
              placeholder="Current password"
              label="Current Password"
              type="password"
            />

            <Input
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              placeholder="New password"
              label="New Password"
              type="password"
            />

            <Input
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              placeholder="Confirm password"
              label="Confirm Password"
              type="password"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-5">
            <button
              type="submit"
              className="btn-primary"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;