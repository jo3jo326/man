import { Link, useNavigate } from 'react-router-dom';
import { APP_NAME, ROUTES } from '../constants';
import styles from '../styles/NavBar.module.css';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

/**
 * NavBar Component
 * Main navigation bar for the application
 */
const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on navigation
  const handleNav = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarBrand}>
          <Link to={ROUTES.HOME} onClick={() => setMenuOpen(false)}>{APP_NAME}</Link>
        </div>
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
        <ul className={`${styles.navbarMenu} ${menuOpen ? styles.menuOpen : ''}`}>
          <li>
            <Link to={ROUTES.HOME} onClick={() => handleNav(ROUTES.HOME)}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.ABOUT} onClick={() => handleNav(ROUTES.ABOUT)}>About</Link>
          </li>
          <li>
            <Link to={ROUTES.DASHBOARD} onClick={() => handleNav(ROUTES.DASHBOARD)}>Dashboard</Link>
          </li>
          <li>
            <Link to={ROUTES.SETTINGS} onClick={() => handleNav(ROUTES.SETTINGS)}>Settings</Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/signup" onClick={() => handleNav('/signup')}>Sign Up</Link>
              </li>
              <li>
                <Link to="/login" onClick={() => handleNav('/login')}>Login</Link>
              </li>
            </>
          )}
          {user && (
            <>
              <li>
                <button
                  className={styles.logoutButton}
                  onClick={() => {
                    logout();
                    handleNav('/login');
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
