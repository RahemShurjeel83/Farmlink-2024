import React, { useState, useEffect } from 'react';
import CSS from './Header.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backedUrl } from '../../apiUrl';
import { useNavigate } from 'react-router';

const Header = () => {
    const userToken = localStorage.getItem('token');
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [length, setLength] = useState(0);
    const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

    const toggleTheme = () => {
        const next = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    };

    useEffect(() => {
        if (userToken) getCartItems();
    }, []);

    const getCartItems = async () => {
        try {
            const { data } = await axios.get(`${backedUrl}/api/getCartItems`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            setLength(data.data?.cartItems?.length || 0);
        } catch {
            // not logged in or token expired — ignore
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const ifUser = localStorage.getItem('token');

    const handleAuth = () => {
        if (ifUser) {
            localStorage.removeItem('token');
            window.location.reload();
        } else {
            navigate('/login');
        }
    };

    return (
        <header className={CSS.header}>
            <div className={CSS.navBar}>
                <div className={CSS.logos}>
                    <Link className={CSS.logo} to={'/'}>
                        <span className={CSS['brand-name']}>🌿 FarmLink</span>
                    </Link>
                </div>
                <ul className={CSS.links}>
                    <li className={CSS.items}><Link className={`${CSS.navItem} ${CSS.active}`} to={'/'}>Home</Link></li>
                    <li className={CSS.items}><Link className={CSS.navItem} to={'/category'}>Categories</Link></li>
                    <li className={CSS.items}><Link className={CSS.navItem} to={'/contact'}>Contact</Link></li>
                    <li className={CSS.items}><Link className={CSS.navItem} to={'/aboutus'}>About</Link></li>
                </ul>
                <div className={CSS['cart-login-container']}>
                    <button className={CSS['theme-toggle']} onClick={toggleTheme} title="Toggle dark mode">
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <Link to={'/checkout'} className={CSS.action_btn}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        {length > 0 && <span className={CSS['cart-length']}>{length}</span>}
                    </Link>
                    <div className={CSS.action_btn} onClick={handleAuth}>
                        {ifUser ? <span>Logout</span> : <i className="fa-solid fa-user"></i>}
                    </div>
                </div>
                <div className={CSS.toggle_btn} onClick={toggleMenu}>
                    <i className={isOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'}></i>
                </div>
            </div>
            <div className={`${CSS.dropdown_menu} ${isOpen ? CSS.open : ''}`}>
                <li className={CSS.items}><Link className={`${CSS.navItem} ${CSS.active}`} to={'/'}>Home</Link></li>
                <li className={CSS.items}><Link className={CSS.navItem} to={'/category'}>Categories</Link></li>
                <li className={CSS.items}><Link className={CSS.navItem} to={'/contact'}>Contact</Link></li>
                <li className={CSS.items}><Link className={CSS.navItem} to={'/aboutus'}>About</Link></li>
                <li className={CSS.items} onClick={handleAuth}><span className={CSS.action_btn}>{ifUser ? 'Logout' : 'Login'}</span></li>
            </div>
        </header>
    );
};

export default Header;
