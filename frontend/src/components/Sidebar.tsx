import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">Productos & Ventas</div>
      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          Dashboard
        </NavLink>
        <NavLink to="/categories" className="sidebar__link">
          Categorías
        </NavLink>
        <NavLink to="/sales/new" className="sidebar__link">
          Nueva venta
        </NavLink>
        <NavLink to="/sales" className="sidebar__link">
          Historial ventas
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
