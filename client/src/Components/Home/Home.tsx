import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageTransition from '../PageTransition/PageTransition.tsx';

const API_URL = import.meta.env.VITE_API_URL;


export default function Home() {
  const [auth, setAuth] = useState<'loading' | 'valid' | 'invalid'>('loading');

  // verify the user's token --> send user back to login if invalid
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return setAuth('invalid');

    axios
      .get(`${API_URL}/api/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setAuth('valid'))
      .catch(() => {
        localStorage.removeItem('authToken');
        setAuth('invalid');
      });
  }, []);

  if (auth === 'loading')
    return (
      <PageTransition>
        <div>Loading...</div>
      </PageTransition>
    );

  if (auth === 'invalid') return <Navigate to="/login" replace />;

  return (
    <PageTransition>
      <h1>HOME PAGE</h1>
    </PageTransition>
  );
}