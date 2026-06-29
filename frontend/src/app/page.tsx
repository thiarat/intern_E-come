'use client';

import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Link from 'next/link';
import { api } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/products')
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.bannerSection}>
        <div className={styles.mainBanner}>
           <h2>Super Shopping Day!</h2>
           <p>Up to 90% Off on top brands.</p>
        </div>
        <div className={styles.sideBanners}>
           <div className={styles.sideBanner1}>Flash Sale</div>
           <div className={styles.sideBanner2}>Free Shipping</div>
        </div>
      </div>

      <div className={styles.categorySection}>
        <Link href="/products?category=Electronics" className={styles.catBox}><span>📱</span><br/>Electronics</Link>
        <Link href="/products?category=Audio" className={styles.catBox}><span>🎧</span><br/>Audio</Link>
        <Link href="/products?category=Wearables" className={styles.catBox}><span>⌚</span><br/>Wearables</Link>
        <Link href="/products?category=Fashion" className={styles.catBox}><span>👕</span><br/>Fashion</Link>
        <Link href="/products?category=Home" className={styles.catBox}><span>🏠</span><br/>Home</Link>
        <Link href="/products?category=Gaming" className={styles.catBox}><span>🎮</span><br/>Gaming</Link>
        <Link href="/products?category=Beauty" className={styles.catBox}><span>💄</span><br/>Beauty</Link>
        <Link href="/products?category=Food" className={styles.catBox}><span>🍔</span><br/>Food</Link>
      </div>

      <div className={styles.sectionHeader}>
        <h2>DAILY DISCOVER</h2>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.productGrid}>
          {products.map(p => (
            <Link href={`/products/${p.id}`} key={p.id} className={styles.productCard}>
              <div className={styles.productImg}>
                {p.images && p.images.length > 0 ? <img src={p.images[0]} alt={p.name} /> : <div className={styles.noImg}>No Image</div>}
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productFooter}>
                  <span className={styles.price}>฿{p.price.toLocaleString()}</span>
                  <span className={styles.sold}>{p.stock} left</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
