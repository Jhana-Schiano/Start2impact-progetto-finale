import { type FC } from "react";
import "./Header.css";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

interface HeaderProps {
  onLogout?: () => void;
}

// Header principale dell'app con logo testuale e azione di logout.
const Header: FC<HeaderProps> = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-logo" aria-label="Js Gym">
          <span className="logo-text">Js Gym</span>
        </h1>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <HiArrowRightOnRectangle size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
