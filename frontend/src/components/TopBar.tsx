import React from "react";
import { useAuth } from "../context/AuthContext";

const TopBar: React.FC = () => {
  const { fullName, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar__title">Panel de administración</div>
      <div className="topbar__right">
        <span className="topbar__user">{fullName}</span>
        <button className="btn btn--ghost" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default TopBar;
