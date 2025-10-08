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
import ReservationConfirmation from './pages/ReservationConfirmation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { migrateExistingData } from './data/localStorage.js';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Kullanıcı bilgilerini localStorage'dan yükle
  useEffect(() => {
    const savedUser = localStorage.getItem('bungalow_user');
    const savedAuth = localStorage.getItem('bungalow_authenticated');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    // Mevcut verileri migration yap
    migrateExistingData();
    
    // Demo verilerini yükleme - sadece migration yap
    setDataLoaded(true);
  }, []);

  const handleLogin = (credentials) => {
    // Basit login simülasyonu - herhangi bir email/şifre ile giriş yapılabilir
    const userData = {
      id: 1,
      name: 'Admin',
      email: credentials.email,
      role: 'admin'
    };
    
    setIsAuthenticated(true);
    setUser(userData);
    
    // Kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem('bungalow_user', JSON.stringify(userData));
    localStorage.setItem('bungalow_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // localStorage'dan kullanıcı bilgilerini temizle
    localStorage.removeItem('bungalow_user');
    localStorage.removeItem('bungalow_authenticated');
  };

  // Veri yüklenene kadar loading göster
  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  console.log('App render - isAuthenticated:', isAuthenticated);
  
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          {/* Public routes - No navigation */}
          <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm/:confirmationCode" element={<ReservationConfirmation />} />
          
          {/* Protected routes - With navigation */}
          <Route path="/" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Dashboard /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/bungalows" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Bungalows /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/bungalows/:id" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <BungalowDetailsPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/bungalows/:id/edit" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <BungalowEditPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/reservations" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Reservations /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/create-reservation" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <CreateReservation /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/customers" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Customers /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/customers/:id" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <CustomerDetailsPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/customers/:id/edit" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <CustomerEditPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/reservations/:id" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <ReservationDetailsPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/reservations/:id/edit" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <ReservationEditPage /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/reports" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Reports /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/settings" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Settings /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
              <div className="pt-16">
                {isAuthenticated ? <Profile /> : <Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />}
              </div>
            </>
          } />
        </Routes>
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