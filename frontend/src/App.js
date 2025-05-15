import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSnapshot } from "valtio";
import state from "./util/Store"; // Make sure this path is correct

import MyPost from "./pages/SkliiPost/MyPost";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Dashboard from "./pages/auth/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OAuth2Success from "./pages/auth/OAuth2Success";
import PlanTemplate from "./pages/plan/PlanTemplate";
import ProfilePage from "./pages/profile/ProfilePage";
import PlanListPage from "./pages/plan/PlanListPage";
import PlanViewPage from "./pages/plan/PlanViewPage";
import SearchPage from "./pages/common/SearchPage";
import UserProfilePage from "./pages/profile/UserProfilePage";
import 'antd/dist/reset.css';
import SkillPostUploader from "./pages/SkliiPost/SkillPostUploader";
import CommentCard from "./pages/comment/CommentCard";
import FriendsPost from "./pages/SkliiPost/FriendsPost";
import PublicPlansPage from "./pages/plan/PublicPlansPage";
import ForYouPage from "./pages/common/ForYouPage";
import ProgressPage from "./pages/plan/ProgressPage";
import AchievementsPage from "./pages/plan/AchievementsPage";

function App() {
  const snap = useSnapshot(state); // 👈 Add this line

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth2-success" element={<OAuth2Success />} />
        <Route path="/plans/create" element={<ProtectedRoute><PlanTemplate /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><PlanListPage /></ProtectedRoute>} />
        <Route path="/plans/edit/:id" element={<ProtectedRoute><PlanTemplate /></ProtectedRoute>} />
        <Route path="/plans/view/:id" element={<ProtectedRoute><PlanViewPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/user/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/mypost" element={<ProtectedRoute><MyPost /></ProtectedRoute>} />
        <Route path="/CommentCard" element={<ProtectedRoute><CommentCard /></ProtectedRoute>} />
        <Route path="/plans/public" element={<ProtectedRoute><PublicPlansPage /></ProtectedRoute>} />
        <Route path="/foryou" element={<ProtectedRoute><ForYouPage /></ProtectedRoute>} />
        <Route path="/plans/progress/:planId" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/FriendsPost" element={<ProtectedRoute><FriendsPost /></ProtectedRoute>}/>
        <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>}/>
      </Routes>

    


      {snap.uploadPostModalOpened && <SkillPostUploader />}

      {snap.upl && <SkillPostUploader />}

    </Router>
  );
}

export default App;