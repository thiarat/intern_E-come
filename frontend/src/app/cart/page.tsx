'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);
    setLoading(false);
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-change'));
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="/products" className={styles.continueBtn}>Continue Shopping</a>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemList}>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.image ? <img src={item.image} alt={item.name} /> : <span>Img</span>}
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>฿{item.price.toLocaleString()}</p>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.qtyControl}>
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <p className={styles.itemTotal}>฿{(item.price * item.quantity).toLocaleString()}</p>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className={styles.divider}></div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={() => window.location.href = '/checkout'}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
