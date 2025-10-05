import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // User bilgilerini oluştur
      const userData = {
        name: 'Admin',
        role: 'Yönetici',
        email: formData.email,
        loginTime: new Date().toISOString()
      };
      onLogin(userData);
    }, 1000);
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
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900'
              }`}
            >
              {isLoading ? (
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
      </div>
    </div>
  );
};

export default Login;
