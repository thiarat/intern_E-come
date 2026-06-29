'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { api } from '../../../utils/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ADMIN' | 'CUSTOMER'>('ALL');

  const fetchUsers = async () => {
    try {
      const res = await api('/api/users');
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api(`/api/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        alert('User role updated successfully');
        fetchUsers();
      } else {
        const data = await res.json();
        alert('Failed to update user role: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await api(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('User deleted successfully');
        fetchUsers();
      } else {
        const data = await res.json();
        alert('Failed to delete user: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  const filteredUsers = users.filter(u => filter === 'ALL' || u.role === filter);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Users Management</h1>
      </div>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabBtn} ${filter === 'ALL' ? styles.activeTab : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Users
        </button>
        <button 
          className={`${styles.tabBtn} ${filter === 'ADMIN' ? styles.activeTab : ''}`}
          onClick={() => setFilter('ADMIN')}
        >
          Admins
        </button>
        <button 
          className={`${styles.tabBtn} ${filter === 'CUSTOMER' ? styles.activeTab : ''}`}
          onClick={() => setFilter('CUSTOMER')}
        >
          Customers
        </button>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id.substring(0, 8)}...</td>
                    <td className={styles.nameCell}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="PRODUCT_ADMIN">PRODUCT_ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className={styles.actions}>
                        <button 
                          className={styles.deleteBtn} 
                          onClick={() => handleDeleteUser(u.id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No users found in this category</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
