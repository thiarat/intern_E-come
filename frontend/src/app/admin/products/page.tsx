'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { api } from '../../../utils/api';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api('/api/products');
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await api(`/api/products/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('Product deleted');
          fetchProducts();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products Management</h1>
        <Link href="/admin/products/create" className={styles.primaryBtn}>
          + Add New Product
        </Link>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.imgWrapper}>
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} />
                        ) : (
                          <div className={styles.noImg}></div>
                        )}
                      </div>
                    </td>
                    <td className={styles.nameCell}>{p.name}</td>
                    <td>฿{p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td>{p.category?.name || 'Uncategorized'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button className={styles.editBtn} onClick={() => router.push(`/admin/products/create?edit=${p.id}`)}>Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No products found</td>
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
