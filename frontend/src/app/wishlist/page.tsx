'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { api } from '../../utils/api';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);

    async function fetchWishlist() {
      try {
        const res = await api(`/api/wishlist/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setWishlist(data);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);

    try {
      const res = await api(`/api/wishlist/toggle`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, productId })
      });
      if (res.ok) {
        setWishlist(wishlist.filter(item => item.productId !== productId));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  if (loading) return <div className={styles.loading}>Loading wishlist...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your wishlist is empty</h2>
          <p>Find something you love and save it here.</p>
          <a href="/products" className={styles.shopBtn}>Explore Products</a>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlist.map((item) => (
            <div key={item.id} className={styles.card}>
              <button 
                className={styles.removeBtn} 
                onClick={() => removeFromWishlist(item.productId)}
                title="Remove from wishlist"
              >
                ✕
              </button>
              <a href={`/products/${item.productId}`} className={styles.cardLink}>
                <div className={styles.imageBox}>
                  {item.product.image ? <img src={item.product.image} alt={item.product.name} /> : <span>No Img</span>}
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.product.name}</h3>
                  <p className={styles.price}>฿{item.product.price.toLocaleString()}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
