'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { api } from '../../utils/api';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = category 
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
        const res = await api(url);
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  const toggleWishlist = async (productId: string) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login first');
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    try {
      const res = await api(`/api/wishlist/toggle`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, productId })
      });
      if (res.ok) {
        alert('Wishlist updated!');
      } else {
        alert('Failed to update wishlist');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images && product.images.length > 0 ? product.images[0] : undefined
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-change'));
    alert('Added to cart!');
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>All Products</h1>
        <a href="/wishlist" className={styles.wishlistLink}>My Wishlist ❤️</a>
      </div>
      
      {products.length === 0 ? (
        <p className={styles.emptyMessage}>No products available right now.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <button 
                className={styles.wishlistBtn}
                onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                title="Add to wishlist"
              >
                ♡
              </button>
              <a href={`/products/${product.id}`} className={styles.cardLink}>
                <div className={styles.imagePlaceholder}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className={styles.image} />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productDesc}>{product.description || 'No description available'}</p>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>฿{product.price.toLocaleString()}</span>
                    <button className={styles.addToCartBtn} disabled={product.stock === 0} onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}>
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
