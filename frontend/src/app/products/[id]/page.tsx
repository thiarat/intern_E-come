'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import DOMPurify from 'dompurify';
import { api } from '../../../utils/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    if (product?.htmlDescription) {
      setSanitizedHtml(DOMPurify.sanitize(product.htmlDescription));
    }
  }, [product]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, revRes] = await Promise.all([
          api(`/api/products/${id}`),
          api(`/api/reviews/product/${id}`)
        ]);
        
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProduct(data);
          if (data.images && data.images.length > 0) {
            setMainImage(data.images[0]);
          }
        }
        if (revRes.ok) setReviews(await revRes.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const toggleWishlist = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login first');
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    try {
      await api(`/api/wishlist/toggle`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, productId: id })
      });
      alert('Wishlist updated!');
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login first');
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    setSubmitting(true);
    try {
      const res = await api('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });
      if (res.ok) {
        const savedReview = await res.json();
        if (!savedReview.user) savedReview.user = { name: 'You' }; 
        setReviews([savedReview, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!product) return <div className={styles.error}>Product not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.productSection}>
        <div className={styles.imageGallery}>
          <div className={styles.imageBox}>
            {mainImage ? <img src={mainImage} alt={product.name} /> : <div>No Image</div>}
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {product.images.map((img: string, idx: number) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${product.name} thumbnail ${idx}`}
                  className={`${styles.thumbnail} ${mainImage === img ? styles.thumbnailActive : ''}`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>
        <div className={styles.detailsBox}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>฿{product.price.toLocaleString()}</p>
          <p className={styles.desc}>{product.description}</p>
          <p className={styles.stock}>Stock: {product.stock}</p>
          <div className={styles.actionButtons}>
            <button className={styles.addCartBtn} disabled={product.stock === 0} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className={styles.wishlistBtn} onClick={toggleWishlist} title="Add to Wishlist">
              ❤️
            </button>
          </div>
        </div>
      </div>

      {product.htmlDescription && (
        <div className={styles.richDescriptionSection}>
          <h2>Product Description</h2>
          <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
        </div>
      )}

      <div className={styles.reviewSection}>
        <h2>Customer Reviews</h2>
        
        <form onSubmit={submitReview} className={styles.reviewForm}>
          <h3>Write a review</h3>
          <div className={styles.starRatingInteractive}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star}
                className={`${styles.starInteractive} ${newReview.rating >= star ? styles.active : ''}`}
                onClick={() => setNewReview({ ...newReview, rating: star })}
              >
                ★
              </span>
            ))}
          </div>
          <textarea 
            required 
            rows={4} 
            placeholder="What did you like or dislike?"
            value={newReview.comment}
            onChange={e => setNewReview({...newReview, comment: e.target.value})}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        <div className={styles.reviewList}>
          {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <strong>{r.user?.name || 'Anonymous'}</strong>
                <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className={styles.reviewDate}>{new Date(r.createdAt).toLocaleDateString()}</p>
              <p className={styles.reviewComment}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
