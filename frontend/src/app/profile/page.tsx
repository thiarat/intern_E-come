'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { api } from '../../utils/api';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    async function fetchProfile() {
      try {
        const res = await api(`/api/users/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setName(data.name || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
        } else {
          setError('Failed to fetch user profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Network error. Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError('');

    try {
      const res = await api(`/api/users/${profile.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, phone, email })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
        // Update user in local storage so header updates
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading profile...</div>;
  if (error && !profile) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>
      
      {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontWeight: 600 }}>{error}</div>}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="text" 
              id="phone" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className={styles.input}
              placeholder="e.g. 0812345678"
            />
          </div>

          <button type="submit" disabled={saving} className={styles.submitBtn}>
            {saving ? 'Saving changes...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Saved Shipping Addresses</h2>
        {profile?.addresses && profile.addresses.length > 0 ? (
          <div className={styles.addressList}>
            {profile.addresses.map((addr: any) => (
              <div key={addr.id} className={styles.addressCard}>
                <p>
                  <strong>Detail:</strong> {addr.detail}<br/>
                  <strong>Area:</strong> {addr.subDistrict}, {addr.district}, {addr.province} {addr.zipCode}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noAddress}>No addresses saved yet. You can add one during checkout.</p>
        )}
      </div>
    </div>
  );
}
