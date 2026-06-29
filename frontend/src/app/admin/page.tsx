'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { api } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Dashboard Stats...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Sales</p>
            <h3 className={styles.statValue}>฿{(stats?.totalSales || 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🛒</div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Active Orders</p>
            <h3 className={styles.statValue}>{stats?.activeOrders || 0}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Users</p>
            <h3 className={styles.statValue}>{(stats?.totalUsers || 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Total Products</p>
            <h3 className={styles.statValue}>{(stats?.totalProducts || 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className={styles.recentOrdersSection}>
        <h2>Recent Orders</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td>#{order.id.slice(0, 8)}...</td>
                    <td>{order.customer}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString('th-TH')}</td>
                    <td>
                      <span className={`${styles.badge} ${
                        order.status === 'DELIVERED' ? styles.badgeShipped : styles.badgePending
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>฿{order.total.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
