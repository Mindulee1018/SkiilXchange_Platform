// pages/ProfilePage.jsx
import React from 'react';
import useProfile from '../../hooks/useProfile';

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {profile.id}</p>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
    </div>
  );
};

export default ProfilePage;