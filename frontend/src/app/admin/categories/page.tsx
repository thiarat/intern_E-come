'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { api } from '../../../utils/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) return;
    setSubmitting(true);

    try {
      const res = await api('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        setName('');
        alert('Category created successfully!');
        fetchCategories();
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await api(`/api/categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Category deleted successfully!');
        fetchCategories();
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>Categories Management</h1>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Add New Category</h2>
          <form onSubmit={handleCreate} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="categoryName">Category Name</label>
              <input 
                type="text" 
                id="categoryName" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                className={styles.input}
                placeholder="e.g. Home Appliances"
              />
            </div>
            <button type="submit" disabled={submitting} className={styles.submitBtn}>
              {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Category List</h2>
          {loading ? (
            <div className={styles.loading}>Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className={styles.noCategories}>No categories found.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id.slice(0, 8)}...</td>
                    <td>{c.name}</td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
