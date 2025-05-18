import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./common/navbar";
import useProfile from "../hooks/useProfile";

const SettingsPage = () => {
  const { profile } = useProfile(); // fetch user from hook
  const userId = profile?.id;

  const [settings, setSettings] = useState({
    commentNotifications: true,
    likeNotifications: true,
    progressUpdateNotifications: true,
    deadlineNotifications: true,
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchSettings();
    }
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/settings/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings(prev => ({ ...prev, ...res.data }));
      setError(null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings.");
    }
  };

  const updateSettings = async (field, value) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    setIsUpdating(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8080/api/settings/${userId}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>

      <div className="container mt-5">
        <h3 className="pt-5">Notification Settings</h3>
        <hr />
        {error && <div className="alert alert-danger">{error}</div>}
        {[
          { label: "Comments", key: "commentNotifications" },
          { label: "Likes", key: "likeNotifications" },
          { label: "Progress Updates", key: "progressUpdateNotifications" },
          { label: "Deadlines", key: "deadlineNotifications" },
        ].map(({ label, key }) => (
          <div key={key} className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id={key}
              checked={settings[key]}
              disabled={isUpdating}
              onChange={(e) => updateSettings(key, e.target.checked)}
            />
            <label className="form-check-label" htmlFor={key}>
              {label} Notifications
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default SettingsPage;
