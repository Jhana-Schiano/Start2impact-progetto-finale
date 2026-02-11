import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineBuildingOffice2,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from "react-icons/hi2";
import "./Layout.css";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
        <button
          className="sidebar-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
        >
          <span className="sidebar-toggle-icon" aria-hidden>
            {collapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
          </span>
        </button>

        <nav className="sidebar-nav" aria-label="Main">
          <ul className="sidebar-menu">
            <li>
              <NavLink
                to="/clienti"
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " is-active" : ""}`
                }
              >
                <span className="sidebar-item-icon" aria-hidden>
                  <HiOutlineUsers />
                </span>
                <span className="sidebar-label">Clienti</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profilo"
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " is-active" : ""}`
                }
              >
                <span className="sidebar-item-icon" aria-hidden>
                  <HiOutlineUserCircle />
                </span>
                <span className="sidebar-label">Profilo</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/palestra"
                className={({ isActive }) =>
                  `sidebar-link${isActive ? " is-active" : ""}`
                }
              >
                <span className="sidebar-item-icon" aria-hidden>
                  <HiOutlineBuildingOffice2 />
                </span>
                <span className="sidebar-label">Palestra</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="layout-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
