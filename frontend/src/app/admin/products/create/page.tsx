'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { api } from '../../../../utils/api';

export default function CreateProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    htmlDescription: '',
    images: '', // comma separated for now
    categoryId: ''
  });

  useEffect(() => {
    // Load categories
    api('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Error loading categories:', err));

    if (editId) {
      async function loadProduct() {
        try {
          const res = await api(`/api/products/${editId}`);
          if (res.ok) {
            const p = await res.json();
            setFormData({
              name: p.name,
              price: String(p.price),
              stock: String(p.stock),
              description: p.description || '',
              htmlDescription: p.htmlDescription || '',
              images: p.images ? p.images.join(', ') : '',
              categoryId: p.categoryId || ''
            });
          }
        } catch (err) {
          console.error(err);
        }
      }
      loadProduct();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.images.split(',').map(url => url.trim()).filter(url => url !== '')
    };

    try {
      const url = editId ? `/api/products/${editId}` : '/api/products';
      const method = editId ? 'PUT' : 'POST';

      const res = await api(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editId ? 'Product updated successfully!' : 'Product created successfully!');
        router.push('/admin/products');
      } else {
        const data = await res.json();
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert(editId ? 'Failed to update product' : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{editId ? 'Edit Product' : 'Create New Product'}</h1>
        <button onClick={() => router.back()} className={styles.backBtn}>Back</button>
      </div>

      <form onSubmit={handleSubmit} className={styles.card}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Product Name</label>
            <input 
              required 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Price (฿)</label>
            <input 
              required 
              type="number" 
              min="0"
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Stock</label>
            <input 
              required 
              type="number" 
              min="0"
              value={formData.stock} 
              onChange={e => setFormData({...formData, stock: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={e => setFormData({...formData, categoryId: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                background: 'white',
                fontSize: '1rem',
                outline: 'none',
                height: '46px'
              }}
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Image URLs (comma separated)</label>
            <input 
              type="text" 
              placeholder="https://img1.jpg, https://img2.jpg"
              value={formData.images} 
              onChange={e => setFormData({...formData, images: e.target.value})} 
            />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Short Description</label>
            <textarea 
              rows={2}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label>Rich HTML Description</label>
            <textarea 
              rows={5}
              placeholder="<p>Full description here</p>"
              value={formData.htmlDescription} 
              onChange={e => setFormData({...formData, htmlDescription: e.target.value})} 
            />
          </div>
        </div>
        
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
