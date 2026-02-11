import { type FC } from "react";
import "./Header.css";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

interface HeaderProps {
  onLogout?: () => void;
}

const Header: FC<HeaderProps> = ({ onLogout }) => {
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
          <img src="assets/logo.png" alt="JS Gym Logo" className="logo-image" />
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <HiArrowRightOnRectangle size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
