import React from "react";
import "./Header.css";
import { HiBackward } from "react-icons/hi2";

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    console.log("Logout clicked");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/logo.png" alt="JS Gym Logo" className="logo-image" />
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <HiBackward size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
