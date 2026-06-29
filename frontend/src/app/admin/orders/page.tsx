'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { api } from '../../../utils/api';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [activeAddress, setActiveAddress] = useState<any>(null);

  const openMap = (address: any) => {
    setActiveAddress(address);
    setShowMapModal(true);
  };

  useEffect(() => {
    if (!showMapModal || !activeAddress) return;

    // Load Leaflet css
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet js
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      const lat = activeAddress.lat || 13.7563;
      const lng = activeAddress.lng || 100.5018;
      
      const mapContainer = document.getElementById('delivery-map');
      if (mapContainer) {
        mapContainer.innerHTML = '';
        const mapEl = document.createElement('div');
        mapEl.style.width = '100%';
        mapEl.style.height = '400px';
        mapEl.id = 'map-instance';
        mapContainer.appendChild(mapEl);

        const L = (window as any).L;
        const map = L.map('map-instance').setView([lat, lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Customer marker
        L.marker([lat, lng]).addTo(map)
          .bindPopup(`<b>Delivery Address</b><br>${activeAddress.detail}`)
          .openPopup();
          
        // Shop marker (Siam Paragon origin)
        L.marker([13.7468, 100.5348], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map)
          .bindPopup('<b>NEXUS Shop (Origin)</b>');
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, [showMapModal, activeAddress]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await api('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await api(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        alert('Order status updated successfully');
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        const data = await res.json();
        alert('Failed to update status: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Orders...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Orders</h1>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Total (฿)</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}...</td>
                  <td>
                    <strong>{order.user?.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ maxWidth: '250px', fontSize: '0.9rem' }}>
                    {order.address ? (
                      <div>
                        <div>{`${order.address.detail}, ${order.address.subDistrict}, ${order.address.district}, ${order.address.province} ${order.address.zipCode}`}</div>
                        <button 
                          onClick={() => openMap(order.address)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563EB',
                            padding: 0,
                            marginTop: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            textDecoration: 'underline',
                            fontWeight: 600
                          }}
                        >
                          🗺️ View Map
                        </button>
                      </div>
                    ) : (
                      <em style={{ color: '#999' }}>No Address</em>
                    )}
                  </td>
                  <td>฿{order.totalAmount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['pay-' + (order.payment?.method || 'UNKNOWN')]}`}>
                      {order.payment?.method}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={styles.statusSelect}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td>
                    {order.payment?.slipUrl ? (
                      <a 
                        href={order.payment.slipUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className={styles.actionBtn}
                        style={{
                          display: 'inline-block',
                          textDecoration: 'none',
                          textAlign: 'center',
                          backgroundColor: '#0070f3',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}
                      >
                        View Slip
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#999' }}>No Slip (COD)</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showMapModal && activeAddress && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Delivery Location</h3>
              <button 
                onClick={() => { setShowMapModal(false); setActiveAddress(null); }}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div id="delivery-map" style={{ width: '100%', height: '400px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
              Loading Map...
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '1rem', marginBottom: 0 }}>
              <strong>Address:</strong> {activeAddress.detail}, {activeAddress.subDistrict}, {activeAddress.district}, {activeAddress.province} {activeAddress.zipCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
