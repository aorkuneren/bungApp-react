import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sistemde kayıtlı email listesi (gerçek uygulamada API'den gelecek)
  const registeredEmails = [
    'admin@bungalovapp.com'
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = (email) => {
    return registeredEmails.includes(email.toLowerCase());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      setError('E-posta adresi boş bırakılamaz');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }

    // Email format kontrolü geçtiyse, sistemde kayıtlı olup olmadığını kontrol et
    if (!checkEmailExists(email)) {
      setError('Bu e-posta adresi sistemde kayıtlı değil. Lütfen kayıtlı e-posta adresinizi giriniz.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - email sistemde kayıtlı
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-800">
              E-posta Gönderildi
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Şifre sıfırlama bağlantısı <strong>{email}</strong> adresine gönderildi.
            </p>
            <p className="mt-4 text-center text-sm text-gray-600">
              E-posta kutunuzu kontrol edin ve spam klasörünü de kontrol etmeyi unutmayın.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Giriş Sayfasına Dön
            </Link>
            
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-200 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Başka E-posta Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gray-900 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">B</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-800">
            Şifremi Unuttum
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
              E-posta Adresi
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleInputChange}
              className={`mt-1 appearance-none relative block w-full px-3 py-2 border bg-white ${
                error ? 'border-red-600' : 'border-gray-200'
              } placeholder-gray-400 text-gray-800 rounded-md focus:outline-none focus:ring-gray-900 focus:border-gray-900 focus:z-10 sm:text-sm`}
              placeholder="ornek@email.com"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">{error}</p>
            )}
          </div>

          <div className="space-y-4">
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
                  Gönderiliyor...
                </div>
              ) : (
                'Şifre Sıfırlama Bağlantısı Gönder'
              )}
            </button>
            
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-200 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Giriş Sayfasına Dön
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
