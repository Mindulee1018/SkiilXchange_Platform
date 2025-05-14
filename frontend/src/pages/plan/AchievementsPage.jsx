import React, { useEffect, useState } from "react";
import Navbar from '../../components/common/navbar';
import ProfileSidebar from '../../components/profile/ProfileSidebar';

const AchievementsPage = () => {
  const [earned, setEarned] = useState([]);
  const [toBeEarned, setToBeEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const earnedRes = await fetch("http://localhost:8080/api/achievements/earned", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const toBeEarnedRes = await fetch("http://localhost:8080/api/achievements/to-be-earned", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const earnedData = await earnedRes.json();
        const toBeData = await toBeEarnedRes.json();

        setEarned(earnedData);
        setToBeEarned(toBeData);
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [token]);

  if (loading) return <div className="container mt-5">Loading achievements...</div>;

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <ProfileSidebar />
          </div>

          {/* Main content */}
          <div className="col-md-9">
            <h2 className="mb-4">Your Achievements</h2>

            <div className="mb-5">
              <h4 className="text-success">🏆 Earned Achievements</h4>
              {earned.length === 0 ? (
                <p className="text-muted">You haven’t earned any achievements yet.</p>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4 mt-2">
                  {earned.map((a) => (
                    <div className="col" key={a.achievementCode}>
                      <div className="card border-success h-100">
                        <div className="card-body">
                          <h5 className="card-title">{a.achievementCode}</h5>
                          <p className="card-text text-muted">
                            Earned on {new Date(a.achievedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-secondary">🔒 To Be Earned</h4>
              {toBeEarned.length === 0 ? (
                <p className="text-muted">You've earned all available achievements!</p>
              ) : (
                <div className="row row-cols-1 row-cols-md-2 g-4 mt-2">
                  {toBeEarned.map((a) => (
                    <div className="col" key={a.code}>
                      <div className="card border-secondary h-100">
                        <div className="card-body">
                          <h5 className="card-title">{a.icon} {a.title}</h5>
                          <p className="card-text text-muted">{a.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AchievementsPage;