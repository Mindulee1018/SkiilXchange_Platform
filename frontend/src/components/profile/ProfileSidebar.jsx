import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';


const ProfileSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
  className="bg-dark text-white vh-100 p-3"
  style={{
    width: collapsed ? '60px' : '220px',
    marginLeft: '0px',
    paddingLeft: '0px',
  }}
>
      <button
        className="btn btn-sm btn-outline-secondary mb-3 align-self-end"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <nav className="w-100">
        <ul className="nav flex-column">
        <li className="nav-item mb-2">
            <Link to="/profile" className="nav-link text-white">
              {collapsed ? '👤' : 'Profile'}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/plans" className="nav-link text-white">
              {collapsed ? '📄' : 'Your Plans'}
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/achievements" className="nav-link text-white">
              {collapsed ? '🏆' : 'Achievements'}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className="nav-link text-white">
              {collapsed ? '⚙️' : 'Settings'}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;