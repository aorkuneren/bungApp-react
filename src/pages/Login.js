import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [testingDb, setTestingDb] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation as user types
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';

    if (fieldName === 'email') {
      if (!value.trim()) {
        error = 'E-posta adresi boş bırakılamaz';
      } else if (!validateEmail(value)) {
        error = 'Lütfen geçerli bir e-posta adresi giriniz';
      }
    } else if (fieldName === 'password') {
      if (!value) {
        error = 'Şifre alanı boş bırakılamaz';
      } else if (value.length < 6) {
        error = 'Şifre en az 6 karakter uzunluğunda olmalıdır';
      } else if (value.length > 50) {
        error = 'Şifre en fazla 50 karakter uzunluğunda olabilir';
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta adresi boş bırakılamaz';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Lütfen geçerli bir e-posta adresi giriniz (örn: kullanici@email.com)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Şifre alanı boş bırakılamaz';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter uzunluğunda olmalıdır';
    } else if (formData.password.length > 50) {
      newErrors.password = 'Şifre en fazla 50 karakter uzunluğunda olabilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth service and displayed via toast
      console.error('Login error:', error);
    }
  };

  // Database bağlantısını test et
  const testDatabaseConnection = async () => {
    setTestingDb(true);
    try {
      const response = await fetch('https://demo.aorkuneren.com/database-test.php');
      const text = await response.text();
      
      if (text.includes('Database bağlantısı başarılı')) {
        setDbStatus('success');
        toast.success('Database bağlantısı başarılı!');
      } else {
        setDbStatus('error');
        toast.error('Database bağlantı hatası!');
      }
    } catch (error) {
      setDbStatus('error');
      toast.error('Database test hatası: ' + error.message);
    } finally {
      setTestingDb(false);
    }
  };

  // Hızlı giriş (demo için)
  const handleQuickLogin = async () => {
    setFormData({
      email: 'admin@aorkuneren.com',
      password: 'password'
    });
    
    try {
      await login({
        email: 'admin@aorkuneren.com',
        password: 'password'
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Quick login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-800">
            BungApp'e Giriş Yap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hesabınıza erişim sağlayın
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border bg-white ${
                  errors.email ? 'border-red-600' : 'border-gray-200'
                } placeholder-gray-400 text-gray-800 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 focus:z-10 sm:text-sm`}
                placeholder="ornek@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Şifre
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full px-3 py-2 pr-10 border bg-white ${
                    errors.password ? 'border-red-600' : 'border-gray-200'
                  } placeholder-gray-400 text-gray-800 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 focus:z-10 sm:text-sm`}
                  placeholder="Şifrenizi giriniz"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-200 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800">
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-gray-600 hover:text-gray-800">
                Şifremi unuttum
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>
        </form>

        {/* Database Test ve Hızlı Giriş */}
        <div className="mt-6 space-y-4">
          {/* Database Test */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Database Bağlantı Testi</h3>
            <button
              type="button"
              onClick={testDatabaseConnection}
              disabled={testingDb}
              className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                testingDb ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {testingDb ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Test Ediliyor...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Database Bağlantısını Test Et
                </>
              )}
            </button>
            
            {dbStatus && (
              <div className={`mt-2 p-2 rounded-md text-sm ${
                dbStatus === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {dbStatus === 'success' ? '✅ Database bağlantısı başarılı!' : '❌ Database bağlantı hatası!'}
              </div>
            )}
          </div>

          {/* Hızlı Giriş */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Demo Giriş</h3>
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={loading}
              className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <BoltIcon className="w-4 h-4 mr-2" />
              Hızlı Giriş (Admin)
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              Email: admin@aorkuneren.com<br />
              Şifre: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
