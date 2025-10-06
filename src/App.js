import React, { useState } from 'react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Frontend-only mode: always authenticated
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin',
    email: 'admin@example.com',
    role: 'admin'
  });

  const handleLogin = (credentials) => {
    // Frontend-only mode: simple login simulation
    setIsAuthenticated(true);
    setUser({
      id: 1,
      name: 'Admin',
      email: credentials.email,
      role: 'admin'
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Navigation user={user} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        <div className="pt-16">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Frontend-only routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bungalows" element={<Bungalows />} />
            <Route path="/bungalows/:id" element={<BungalowDetailsPage />} />
            <Route path="/bungalows/:id/edit" element={<BungalowEditPage />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/create-reservation" element={<CreateReservation />} />
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