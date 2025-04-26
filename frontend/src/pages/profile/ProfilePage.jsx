
import React, { useState } from 'react';
import useProfile from '../../hooks/useProfile';
import NotificationPanel from '../../components/common/NotificationPanel';
import Navbar from '../../components/common/navbar';

import { BsBellFill } from "react-icons/bs";

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
  };

// pages/ProfilePage.jsx
import React from 'react';
import useProfile from '../../hooks/useProfile';

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Profile</h2>

          <div>
            <button onClick={toggleNotifications} className="btn btn-outline-warning" >
              <BsBellFill  />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded-lg w-72">
                <NotificationPanel />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p><strong>ID:</strong> {profile.id}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

    <div>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
};

export default ProfilePage;
