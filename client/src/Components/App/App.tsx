import React from 'react';
import '@mantine/core/styles.css';
import Login from '../Login/Login.tsx';
import Signup from '../Signup/Signup.tsx';
import Home from '../Home/Home.tsx';
import Redirect from '../Redirect/Redirect.tsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<Redirect />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
