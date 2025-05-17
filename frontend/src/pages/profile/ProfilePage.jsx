// pages/auth/ProfilePage.jsx

import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useProfile from "../../hooks/useProfile";
import Navbar from "../../components/common/navbar";
import ProfileSidebar from "../../components/profile/ProfileSidebar";
import { BsBellFill } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";
import axios from "axios";
import Form from "react-bootstrap/Form";

const ProfilePage = () => {
  const { profile, loading, error, refreshProfile } = useProfile();
  const [publicPlans, setPublicPlans] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [deadlines, setDeadlines] = useState([]);
  const [showDeadlines, setShowDeadlines] = useState(false);
  const [loadingDeadlines, setLoadingDeadlines] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [progressUpdates, setProgressUpdates] = useState([]);
  const [showProgressUpdates, setShowProgressUpdates] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progressTab, setProgressTab] = React.useState("unread"); // 'unread' or 'all'
  const unreadCount = progressUpdates.filter((update) => !update.read).length;

  const [editForm, setEditForm] = useState({
    username: "",
    description: "",
    profilePicture: "",
  });

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const toggleDeadlines = () => {
    setShowDeadlines((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleProgressUpdates = () => {
    setShowProgressUpdates((prev) => !prev);
  };

  const handleEditClick = () => {
    setEditForm({
      username: profile.username || "",
      description: profile.description || "",
      profilePicture: profile.profilePicture || "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let uploadedImageUrl = profile.profilePicture;

      //Upload image file if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch(
          "http://localhost:8080/api/auth/user/upload/profile-picture",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.imageUrl;
      }

      //Update user profile
      const res = await fetch("http://localhost:8080/api/auth/user/edit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editForm,
          profilePicture: uploadedImageUrl,
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        refreshProfile();
      } else {
        console.error("Profile update failed");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const fetchPublicPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:8080/api/learning-plans/user/public",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPublicPlans(data);
      }
    } catch (err) {
      console.error("Error fetching public plans", err);
    }
  };

  const fetchFollowersAndFollowing = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = profile?.id;

      if (userId) {
        const followersRes = await fetch(
          `http://localhost:8080/api/users/${userId}/followers`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const followingRes = await fetch(
          `http://localhost:8080/api/users/${userId}/following`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (followersRes.ok) setFollowersList(await followersRes.json());
        if (followingRes.ok) setFollowingList(await followingRes.json());
      }
    } catch (err) {
      console.error("Error fetching followers/following", err);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/notifications/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const fetchProgressUpdates = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/ProgressUpdate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProgressUpdates(data);
      } else {
        console.error("Failed to fetch progress updates");
      }
    } catch (err) {
      console.error("Error fetching progress updates", err);
    }
  };

  const fetchDeadlines = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/deadlines/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setDeadlines(data);
      }
    } catch (err) {
      console.error("Failed to fetch deadlines", err);
    }
  };

  const markAsRead = async (updateId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/ProgressUpdate/${updateId}/mark-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Optionally refresh the updates list here
        fetchProgressUpdates(); // make sure this function is defined
      }
    } catch (error) {
      console.error("Error marking update as read", error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const userId = profile?.id;
    if (!userId || !token) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/ProgressUpdate/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProgressUpdates((prevUpdates) =>
          prevUpdates.map((update) => ({ ...update, read: true }))
        );
      } else {
        console.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };


  useEffect(() => {
    if (profile?.id) {
      fetchPublicPlans();
      fetchFollowersAndFollowing();
      fetchProgressUpdates();
      fetchDeadlines(profile.id);
      fetchNotifications(profile.id);
    }
  }, [profile]);

  if (loading) return <div className="container mt-5">Loading profile...</div>;
  if (error) return <div className="container mt-5">{error}</div>;

  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="container-fluid mt-5 px-2 px-md-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-md-3 mb-4">
            <div className="position-sticky" style={{ top: "85px" }}>
              <ProfileSidebar
                isCollapsed={isCollapsed}
                toggleCollapse={toggleSidebar}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-9">
            <div className="position-relative mb-4">

              <div className="d-flex justify-content-end flex-wrap gap-2 mb-2 mt-4">
                {/* Progress Update Button */}
                <button
                  onClick={toggleProgressUpdates}
                  className="btn btn-outline-success position-relative d-flex align-items-center me-2"
                >
                  <BsGraphUp /> {/* Bootstrap icon from react-icons */}
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Deadlines Button */}
                <button
                  onClick={toggleDeadlines}
                  className="btn btn-outline-danger position-relative d-flex align-items-center me-2"
                >
                  ⏰
                  {deadlines.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {deadlines.length}
                    </span>
                  )}
                </button>

                {/* Notifications Button */}
                <button
                  onClick={toggleNotifications}
                  className="btn btn-outline-warning position-relative d-flex align-items-center"
                >
                  <BsBellFill />
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Centered Profile Info */}
              <div className="text-center">
                <img
                  src={
                    profile.profilePicture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                  }
                  alt="Profile"
                  className="rounded-circle"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h2 className="mt-3">{profile.username}</h2>
                <p className="text-muted">
                  {profile.description || "No description provided."}
                </p>
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Progress Updates Panel */}
            <Modal
              show={showProgressUpdates}
              onHide={toggleProgressUpdates}
              dialogClassName="modal-right-side"
              backdrop={true}
              keyboard={true}
              style={{ marginTop: "80px" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Progress Updates</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {progressUpdates.length === 0 ? (
                  <p>No progress updates yet.</p>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-success mb-3"
                      onClick={markAllAsRead}
                    >
                      Mark All as Read
                    </button>

                    {/* Tabs */}
                    <div className="mb-3">
                      <button
                        className={`btn btn-sm me-2 ${progressTab === "unread"
                          ? "btn-primary"
                          : "btn-outline-primary"
                          }`}
                        onClick={() => setProgressTab("unread")}
                      >
                        Unread
                      </button>
                      <button
                        className={`btn btn-sm ${progressTab === "all"
                          ? "btn-primary"
                          : "btn-outline-primary"
                          }`}
                        onClick={() => setProgressTab("all")}
                      >
                        All
                      </button>
                    </div>

                    {/* Progress Updates List */}
                    <ul className="list-group">
                      {(progressTab === "unread"
                        ? progressUpdates.filter((update) => !update.read)
                        : progressUpdates
                      ).map((update) => (
                        <li
                          key={update.id}
                          className={`list-group-item small ${update.read ? "bg-light" : "bg-white"
                            }`}
                        >
                          {update.message ||
                            `${update.planTitle} - Day ${update.dayCompleted} completed`}
                          <br />
                          <small className="text-muted">
                            {new Date(update.timestamp).toLocaleString()}
                          </small>
                          <br />
                          <strong>Status:</strong>{" "}
                          {update.read ? "Read" : "Unread"}
                          <br />
                          {!update.read && (
                            <button
                              className="btn btn-sm btn-primary mt-1"
                              onClick={() => markAsRead(update.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                        </li>
                      ))}
                      {progressTab === "unread" &&
                        progressUpdates.filter((update) => !update.read)
                          .length === 0 && <p>No unread updates.</p>}
                      {progressTab === "all" &&
                        progressUpdates.length === 0 && (
                          <p>No progress updates.</p>
                        )}
                    </ul>
                  </>
                )}
              </Modal.Body>
            </Modal>

            {/* Notifications Panel */}
            <Modal
              show={showNotifications}
              onHide={toggleNotifications}
              dialogClassName="modal-right-side"
              backdrop={true}
              keyboard={true}
              style={{ marginTop: "80px" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Notifications</Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <p>No notifications yet.</p>
                ) : (
                  <ul className="list-group">
                    {notifications.map((notification, index) => (
                      <li
                        key={index}
                        className="list-group-item small bg-white"
                      >
                        <strong>{notification.title || "Notification"}</strong><br />
                        <span>
                          {notification.message ||
                            notification.content ||
                            "You have a new update."}
                        </span>
                        <br />
                        <small className="text-muted">
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>

            {/* Deadlines Panel */}
            <Modal
              show={showDeadlines}
              onHide={toggleDeadlines}
              dialogClassName="modal-right-side"
              backdrop={true}
              keyboard={true}
              style={{ marginTop: "80px" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Upcoming Deadlines</Modal.Title>
              </Modal.Header>

              <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
                {loadingDeadlines ? (
                  <p>Loading...</p>
                ) : deadlines.length === 0 ? (
                  <p>No upcoming deadlines.</p>
                ) : (
                  <ul className="list-group">
                    {deadlines.map((deadline) => (
                      <li
                        key={deadline.id}
                        className="list-group-item small"
                      >
                        <strong>{deadline.taskTitle || "Unnamed Task"}</strong>
                        <br />
                        <small className="text-muted">
                          Due: {new Date(deadline.dueDate).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>

            {/* Followers & Following Buttons */}
            <div className="d-flex justify-content-center flex-wrap gap-2 mt-2 mb-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowFollowers(true)}
              >
                Followers ({profile.followers})
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowFollowing(true)}
              >
                Following ({profile.following})
              </Button>
            </div>

            <hr />

            {/* Public Learning Plans */}
            <h4 className="mb-3">Your Public Learning Plans</h4>
            {publicPlans.length === 0 ? (
              <p>You have no public plans yet.</p>
            ) : (
              <div className="row">
                {publicPlans.map((plan) => (
                  <div key={plan.id} className="col-12 col-sm-6 mb-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">{plan.title}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          {plan.skill}
                        </h6>
                        <p className="card-text">{plan.description}</p>
                        <div className="text-muted small">
                          {plan.tags?.map((tag, i) => {
                            const customColors = [
                              '#6f42c1', // purple
                              '#20c997', // teal
                              '#fd7e14', // orange
                              '#0dcaf0', // cyan
                              '#d63384', // pink
                              '#ffc107', // yellow
                              '#198754', // green
                              '#0d6efd'  // blue
                            ];
                            const bgColor = customColors[i % customColors.length];

                            return (
                              <span
                                key={i}
                                className="badge me-1"
                                style={{
                                  backgroundColor: bgColor,
                                  color: 'white',
                                  padding: '0.5em 0.75em',
                                  fontSize: '0.80rem'
                                }}
                              >
                                {tag}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Followers Modal */}
            <Modal show={showFollowers} onHide={() => setShowFollowers(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Followers</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {followersList.length === 0 ? (
                  <p>No followers yet.</p>
                ) : (
                  <ul className="list-group">
                    {followersList.map((follower, index) => (
                      <li key={index} className="list-group-item">
                        <Link
                          to={`/user/${follower.id}`}
                          className="text-decoration-none"
                        >
                          {follower.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>

            {/* Following Modal */}
            <Modal show={showFollowing} onHide={() => setShowFollowing(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Following</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {followingList.length === 0 ? (
                  <p>Not following anyone yet.</p>
                ) : (
                  <ul className="list-group">
                    {followingList.map((user, index) => (
                      <li key={index} className="list-group-item">
                        <Link
                          to={`/user/${user.id}`}
                          className="text-decoration-none"
                        >
                          {user.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
              <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control name="username" value={editForm.username} onChange={handleEditChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control name="description" value={editForm.description} onChange={handleEditChange} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control type="file" name="profilePicture" onChange={handleFileUpload} accept="image/*" />
                  </Form.Group>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
