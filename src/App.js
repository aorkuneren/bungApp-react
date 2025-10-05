import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
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
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/bungalows" element={<ProtectedRoute><Bungalows /></ProtectedRoute>} />
              <Route path="/bungalows/:id" element={<ProtectedRoute><BungalowDetailsPage /></ProtectedRoute>} />
              <Route path="/bungalows/:id/edit" element={<ProtectedRoute><BungalowEditPage /></ProtectedRoute>} />
              <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
              <Route path="/create-reservation" element={<ProtectedRoute><CreateReservation /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetailsPage /></ProtectedRoute>} />
              <Route path="/customers/:id/edit" element={<ProtectedRoute><CustomerEditPage /></ProtectedRoute>} />
              <Route path="/reservations/:id" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
              <Route path="/reservations/:id/edit" element={<ProtectedRoute><ReservationEditPage /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
    </AuthProvider>
  );
}

export default App;
