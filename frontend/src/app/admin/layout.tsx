'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      setIsAdmin(false);
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role === 'SUPER_ADMIN' || user.role === 'PRODUCT_ADMIN') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      setIsAdmin(false);
      router.push('/login');
    }
  }, [router]);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Products', path: '/admin/products', icon: '📦' },
    { name: 'Categories', path: '/admin/categories', icon: '🏷️' },
    { name: 'Orders', path: '/admin/orders', icon: '🛒' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
  ];

  if (isAdmin === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>Checking permissions...</div>;
  }

  if (isAdmin === false) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#EF4444' }}>Access Denied</h1>
        <p style={{ color: '#64748B' }}>You do not have permission to access the administration area.</p>
        <Link href="/" style={{ background: '#2563EB', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>NEXUS Admin</h2>
        </div>
        <nav className={styles.sidebarNav}>
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navItem}>
            <span className={styles.navIcon}>🏠</span>
            Back to Store
          </Link>
        </div>
      </aside>
      
      <div className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input type="text" placeholder="Search..." className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.adminProfile}>
              <div className={styles.avatar}>A</div>
              <span>Admin User</span>
            </div>
          </div>
        </header>
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
