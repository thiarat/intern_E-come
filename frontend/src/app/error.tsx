'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh', fontFamily: 'sans-serif', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#0F172A', fontWeight: 800 }}>Something went wrong!</h1>
      <p style={{ color: '#64748B', maxWidth: '500px' }}>
        We encountered an error processing your request. This could be due to a temporary network issue or server error.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          onClick={() => reset()}
          style={{ background: '#2563EB', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Try Again
        </button>
        <Link 
          href="/" 
          style={{ border: '1px solid #CBD5E1', color: '#0F172A', padding: '0.75rem 1.5rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
