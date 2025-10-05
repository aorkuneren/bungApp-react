import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Bungalows from './pages/Bungalows';
import BungalowDetailsPage from './pages/BungalowDetailsPage';
import BungalowEditPage from './pages/BungalowEditPage';
import Reservations from './pages/Reservations';
import CreateReservation from './pages/CreateReservation';
import Customers from './pages/Customers';
import CustomerDetailsPage from './pages/CustomerDetailsPage';
import CustomerEditPage from './pages/CustomerEditPage';
import ReservationDetailsPage from './pages/ReservationDetailsPage';
import ReservationEditPage from './pages/ReservationEditPage';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Sayfa yüklendiğinde localStorage'dan authentication durumunu kontrol et
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');
    return token !== null && savedUser !== null;
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  // Token süresini kontrol et
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (!token || !savedUser) {
        handleLogout();
        return;
      }

      // Token süresini kontrol et (24 saat)
      const tokenTime = parseInt(token.split('_')[2]);
      const currentTime = Date.now();
      const tokenAge = currentTime - tokenTime;
      const maxAge = 24 * 60 * 60 * 1000; // 24 saat

      if (tokenAge > maxAge) {
        handleLogout();
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Token oluştur (gerçek uygulamada backend'den gelecek)
    const token = 'auth_token_' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation onLogout={handleLogout} user={user} />}
        <div className={isAuthenticated ? "pt-16" : ""}>
          <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Dashboard /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bungalows" element={<Bungalows />} />
          <Route path="/bungalows/:id" element={<BungalowDetailsPage />} />
          <Route path="/bungalows/:id/edit" element={<BungalowEditPage />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route 
            path="/create-reservation" 
            element={
              isAuthenticated ? 
                <CreateReservation /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetailsPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
          <Route path="/reservations/:id" element={<ReservationDetailsPage />} />
          <Route path="/reservations/:id/edit" element={<ReservationEditPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        {/* Toast Notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#374151',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e5e7eb',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#ffffff',
                secondary: '#000000',
              },
              style: {
                background: '#ffffff',
                color: '#374151',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ffffff',
                secondary: '#000000',
              },
              style: {
                background: '#ffffff',
                color: '#374151',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
            },
            loading: {
              duration: Infinity,
              style: {
                background: '#ffffff',
                color: '#374151',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
