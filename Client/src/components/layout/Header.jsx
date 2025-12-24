import { useState, useEffect } from 'react';
import '../../styles/header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-logo">
                    <a href="/">
                        <span className="logo-icon">📝</span>
                        <span className="logo-text">MyApp</span>
                    </a>
                </div>

                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`header-nav ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="/" onClick={closeMenu}>Posts</a>
                        </li>
                        {isAuthenticated ? (
                            <li className="nav-item">
                                <button className="btn-logout" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <button className="btn-login" onClick={handleLogin}>
                                    Iniciar Sesión
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
