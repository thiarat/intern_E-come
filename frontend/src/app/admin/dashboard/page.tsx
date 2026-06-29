'use client';

import styles from './page.module.css';

export default function AdminDashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Sales</h3>
          <p className={styles.statValue}>฿125,400</p>
          <span className={styles.trendUp}>+15% from last month</span>
        </div>
        <div className={styles.statCard}>
          <h3>Active Orders</h3>
          <p className={styles.statValue}>42</p>
          <span className={styles.trendUp}>+5 new today</span>
        </div>
        <div className={styles.statCard}>
          <h3>Total Products</h3>
          <p className={styles.statValue}>156</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Shipments</h3>
          <p className={styles.statValue}>12</p>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionLinks}>
          <a href="/admin/orders" className={styles.actionBtn}>Manage Orders & Shipments</a>
          <a href="/admin/products" className={styles.actionBtn}>Manage Products</a>
        </div>
      </div>
    </div>
  );
}
