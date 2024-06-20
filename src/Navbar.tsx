
import { NavLink, useLocation } from 'react-router-dom';
import './styling/navbar.css'

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="nav-header">
      <ul className="nav-header-ul">
        <li className={location.pathname === '/products' ? 'active-header' : ''}>
          <NavLink to="/" className="nav-link">
            <p>Products</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
