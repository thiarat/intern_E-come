'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { api } from '../utils/api';

export default function Header() {
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    };
    handleAuthChange();
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-change', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-change', updateCartCount);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      api(`/api/products?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter((p: any) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
          setSuggestions(filtered.slice(0, 5));
        })
        .catch(err => console.error(err));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth-change'));
      alert('Logged out successfully');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topBar}>
        <div className={styles.topBarLinks}>
        </div>
        <div className={styles.topBarLinks}>
          <div className={styles.notifContainer}>
            <button className={styles.navBtn} onClick={() => setShowNotif(!showNotif)}>
              Notifications
            </button>
            {showNotif && (
              <div className={styles.notifDropdown}>
                <p>Welcome to Nexus Delivery!</p>
                <p>No new notifications.</p>
              </div>
            )}
          </div>
          <Link href="/wishlist" className={styles.navLink}>Wishlist</Link>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>Hello, {user.name}</span>
              <Link href="/profile" className={styles.navLink}>Profile</Link>
              <Link href="/my-orders" className={styles.navLink}>My Orders</Link>
              {(user.role === 'SUPER_ADMIN' || user.role === 'PRODUCT_ADMIN') && (
                <Link href="/admin" className={styles.navLink}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <Link href="/login" className={styles.navLink}>Login / Sign Up</Link>
          )}
        </div>
      </div>
      
      <div className={styles.mainHeader}>
        <Link href="/" className={styles.brandLogo}>NEXUS Delivery</Link>
        
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search for products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchBtn}>Search</button>
          </div>
          {suggestions.length > 0 && (
            <div className={styles.autocompleteDropdown}>
              {suggestions.map(s => (
                <Link key={s.id} href={`/products/${s.id}`} className={styles.suggestionItem} onClick={() => setSearchQuery('')}>
                  <div className={styles.suggestionImg}>
                    {s.images && s.images[0] ? <img src={s.images[0]} alt={s.name} /> : <div className={styles.noImg}></div>}
                  </div>
                  <div className={styles.suggestionInfo}>
                    <span className={styles.suggestionName}>{s.name}</span>
                    <span className={styles.suggestionPrice}>฿{s.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/cart" className={styles.cartIconContainer}>
          <span className={styles.cartIcon}>🛒</span>
          <span className={styles.cartText}>Cart ({cartCount})</span>
        </Link>
      </div>
    </div>
  );
}
