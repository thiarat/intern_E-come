'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../utils/api';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER');
  const [loading, setLoading] = useState(false);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipUrl, setSlipUrl] = useState('');
  
  // Address State
  const [useSaved, setUseSaved] = useState(false);
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [detail, setDetail] = useState('');
  const [thaiAddressData, setThaiAddressData] = useState<any[]>([]);

  // Slip Upload State
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (storedCart.length === 0) {
      alert('Your cart is empty');
      router.push('/cart');
      return;
    }
    setCart(storedCart);

    // Fetch full Thailand address database
    fetch('/thai-address-data.json')
      .then(res => res.json())
      .then(data => {
        setThaiAddressData(data);
      })
      .catch(err => console.error('Failed to load address data', err));

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      api(`/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.addresses && data.addresses.length > 0) {
            setSavedAddress(data.addresses[0]);
          }
        })
        .catch(err => console.error('Error fetching user address:', err));
    }
  }, [router]);

  // Calculate actual total amount
  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const storePromptPay = "0812345678"; // Dummy phone number

  // Dynamic QR Payload
  const qrPayload = useMemo(() => {
    return generatePayload(storePromptPay, { amount: totalAmount });
  }, [totalAmount]);

  const provinces = useMemo(() => {
    return thaiAddressData.map(p => p.name_th).sort((a, b) => a.localeCompare(b, 'th'));
  }, [thaiAddressData]);

  const districts = useMemo(() => {
    if (!province) return [];
    const provObj = thaiAddressData.find(p => p.name_th === province);
    if (!provObj) return [];
    return provObj.districts.map((d: any) => d.name_th).sort((a: string, b: string) => a.localeCompare(b, 'th'));
  }, [province, thaiAddressData]);

  const subDistricts = useMemo(() => {
    if (!province || !district) return [];
    const provObj = thaiAddressData.find(p => p.name_th === province);
    if (!provObj) return [];
    const distObj = provObj.districts.find((d: any) => d.name_th === district);
    if (!distObj) return [];
    return distObj.sub_districts;
  }, [province, district, thaiAddressData]);

  const handleSubDistrictChange = (selectedSub: string) => {
    setSubDistrict(selectedSub);
    const subObj = subDistricts.find((sd: any) => sd.name_th === selectedSub);
    if (subObj) {
      setZipCode(String(subObj.zip_code));
    } else {
      setZipCode('');
    }
  };

  const handleSavedAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseSaved(checked);
    if (checked) {
      if (savedAddress) {
        setProvince(savedAddress.province);
        setDistrict(savedAddress.district);
        setSubDistrict(savedAddress.subDistrict);
        setZipCode(savedAddress.zipCode);
        setDetail(savedAddress.detail);
      } else {
        alert('No saved addresses found. Please fill in details below.');
        setUseSaved(false);
      }
    } else {
      setProvince('');
      setDistrict('');
      setSubDistrict('');
      setZipCode('');
      setDetail('');
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const placeOrder = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please login first');
      router.push('/login');
      return;
    }
    const user = JSON.parse(userStr);

    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        paymentMethod,
        slipUrl: paymentMethod === 'TRANSFER' ? slipUrl : null,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        address: {
          province,
          district,
          subDistrict,
          zipCode,
          detail
        }
      };

      const res = await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Order placed successfully! Thank you.');
        localStorage.removeItem('cart');
        router.push('/');
      } else {
        const data = await res.json();
        alert('Failed to place order: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Connection error placing order');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === 'COD') {
      await placeOrder();
    } else {
      setStep(3);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSlipPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file to backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'nexus-slips');

    setUploadingSlip(true);
    try {
      const res = await api('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setSlipUrl(data.url);
        alert('Slip uploaded successfully!');
      } else {
        alert('Failed to upload slip to server');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading slip');
    } finally {
      setUploadingSlip(false);
    }
  };

  const confirmOrder = async () => {
    if (paymentMethod === 'TRANSFER' && !slipUrl) {
      alert('Please upload payment slip first');
      return;
    }
    await placeOrder();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      
      <div className={styles.stepper}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1. Address</div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2. Payment</div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3. Confirm</div>
      </div>

      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Shipping Address</h2>
            <label className={styles.savedAddressToggle}>
              <input type="checkbox" checked={useSaved} onChange={handleSavedAddressToggle} />
              Use Saved Address
            </label>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Province (จังหวัด)</label>
              <select required value={province} onChange={e => {
                setProvince(e.target.value);
                setDistrict('');
                setSubDistrict('');
              }} className={styles.input}>
                <option value="">-- Select Province --</option>
                {provinces.map((p: any) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>District (อำเภอ/เขต)</label>
              <select required value={district} onChange={e => {
                setDistrict(e.target.value);
                setSubDistrict('');
              }} className={styles.input} disabled={!province}>
                <option value="">-- Select District --</option>
                {districts.map((d: any) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Sub-district (ตำบล/แขวง)</label>
              <select required value={subDistrict} onChange={e => handleSubDistrictChange(e.target.value)} className={styles.input} disabled={!district}>
                <option value="">-- Select Sub-district --</option>
                {subDistricts.map((sd: any) => <option key={sd.id} value={sd.name_th}>{sd.name_th}</option>)}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>ZIP Code</label>
              <input required value={zipCode} onChange={e => setZipCode(e.target.value)} className={styles.input} placeholder="e.g. 10330" />
            </div>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Detail (บ้านเลขที่, ซอย, ถนน)</label>
              <textarea required rows={3} value={detail} onChange={e => setDetail(e.target.value)} className={styles.input}></textarea>
            </div>
          </div>
          <button type="submit" className={styles.primaryBtn}>Continue to Payment</button>
        </form>
      )}

      {step === 2 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Payment Method</h2>
          <div className={styles.paymentOptions}>
            <label className={`${styles.radioCard} ${paymentMethod === 'TRANSFER' ? styles.selected : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="TRANSFER" 
                checked={paymentMethod === 'TRANSFER'}
                onChange={() => setPaymentMethod('TRANSFER')}
              />
              <div className={styles.radioContent}>
                <span className={styles.radioTitle}>PromptPay (QR Code)</span>
                <span className={styles.radioDesc}>Scan to pay instantly via banking app</span>
              </div>
            </label>
            <label className={`${styles.radioCard} ${paymentMethod === 'COD' ? styles.selected : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="COD" 
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <div className={styles.radioContent}>
                <span className={styles.radioTitle}>Cash on Delivery (COD)</span>
                <span className={styles.radioDesc}>Pay when you receive the order</span>
              </div>
            </label>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondaryBtn} onClick={() => setStep(1)}>Back</button>
            <button className={styles.primaryBtn} onClick={handlePaymentSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && paymentMethod === 'TRANSFER' && (
        <div className={styles.qrCard}>
          <h2 className={styles.cardTitle}>Scan to Pay</h2>
          <p>Amount to Pay: <strong>฿{totalAmount.toLocaleString()}</strong></p>
          <div className={styles.qrCodeWrapper}>
            <QRCodeSVG value={qrPayload} size={200} />
          </div>
          
          <div className={styles.uploadSection}>
            <label className={styles.uploadLabel}>Upload Payment Slip</label>
            
            {slipPreview ? (
              <div className={styles.previewContainer}>
                <img src={slipPreview} alt="Slip Preview" className={styles.slipPreviewImg} />
                <button className={styles.secondaryBtn} onClick={() => { setSlipPreview(null); setSlipUrl(''); }} disabled={uploadingSlip}>
                  Remove Slip
                </button>
              </div>
            ) : (
              <div className={styles.fileUploadBox}>
                <span>Click to upload slip or drag and drop</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className={styles.hiddenFileInput} />
              </div>
            )}

            <button className={styles.primaryBtn} onClick={confirmOrder} disabled={uploadingSlip || !slipUrl || loading}>
              {uploadingSlip ? 'Uploading Slip...' : loading ? 'Placing Order...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
