
import { NavLink, useLocation } from 'react-router-dom';
import './styling/navbar.css'

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="nav-header">
      <ul className="nav-header-ul">
        <li className={location.pathname === '/deltagere' ? 'active-header' : ''}>
          <NavLink to="/deltagere" className="nav-link">
            <p>Deltagere</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
