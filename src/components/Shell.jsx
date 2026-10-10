import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { asset } from "../lib/asset";
import { ZigzagTrail } from "./ZigzagTrail";

export function Shell() {
  const { pathname } = useLocation();
  const isPanel = pathname.startsWith("/panel");

  useEffect(() => {
    if (pathname.startsWith("/nota/")) return;
    document.title = isPanel ? "ZigZag — Panel" : "ZigZag — Estudio";
  }, [pathname, isPanel]);

  return (
    <div className={`site ${isPanel ? "site-panel" : "site-estudio"}`}>
      <ZigzagTrail />
      <header className="top">
        <div className="wrap top-bar">
          <NavLink to="/" className="brand" end>
            <img src={asset("isotipo.png")} alt="" />
            <span>ZigZag</span>
          </NavLink>
          <nav className="nav" aria-label="Estudio">
            <NavLink to="/" end>
              Estudio
            </NavLink>
            <NavLink to="/panel">Panel</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="foot">
        <div className="wrap foot-grid">
          <div>
            <strong>ZigZag</strong>
            <p>De la dispersión nace nuestro método.</p>
          </div>
          <p className="credit">Identidad de Camila Tatiana Arruguete. Marca ficticia, en proceso.</p>
        </div>
      </footer>
    </div>
  );
}
