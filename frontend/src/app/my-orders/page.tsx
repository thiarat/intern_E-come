'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { api } from '../../utils/api';

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    async function fetchOrders() {
      try {
        const res = await api(`/api/orders/user/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
        setError('Network error. Failed to load orders.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [router]);

  if (loading) return <div className={styles.loading}>Loading orders...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>

      {orders.length === 0 ? (
        <div className={styles.noOrders}>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders with Nexus Delivery yet.</p>
          <a href="/products" className={styles.shopBtn}>Start Shopping</a>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderId}>Order #{order.id.slice(0, 8)}</span>
                  <span className={styles.orderDate}> - {new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                  {order.status}
                </span>
              </div>
              <div className={styles.orderBody}>
                {order.items && order.items.map((item: any) => (
                  <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemInfo}>
                      <div className={styles.itemImage}>
                        {item.product.images && item.product.images.length > 0 ? (
                          <img src={item.product.images[0]} alt={item.product.name} />
                        ) : (
                          <span>No Img</span>
                        )}
                      </div>
                      <div>
                        <div className={styles.itemName}>{item.product.name}</div>
                        <div className={styles.itemQty}>Quantity: {item.quantity}</div>
                      </div>
                    </div>
                    <span className={styles.itemPrice}>฿{item.priceAtPurchase.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <div className={styles.orderSummary}>
                  <div className={styles.paymentInfo}>
                    Method: {order.payment?.method} ({order.payment?.status})
                  </div>
                  {order.shipment?.distance && (
                    <div className={styles.paymentInfo}>
                      Shipping: {order.shipment.distance.toFixed(1)} km ({order.shipment.estimatedTime} mins)
                    </div>
                  )}
                </div>
                <div className={styles.totalAmount}>
                  Total: ฿{order.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
