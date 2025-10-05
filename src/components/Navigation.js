import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: HomeIcon },
    { path: '/bungalows', name: 'Bungalovlar', icon: BuildingOfficeIcon },
    { path: '/reservations', name: 'Rezervasyonlar', icon: CalendarIcon },
    { path: '/customers', name: 'Müşteriler', icon: UsersIcon },
    { path: '/reports', name: 'Raporlar', icon: ChartBarIcon },
    { path: '/settings', name: 'Ayarlar', icon: CogIcon },
  ];

  // Dropdown dışına tıklama ile kapanma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mobil menü kapanması için
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Don't render navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Sol taraf - Logo ve App Adı */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">BungApp</h1>
          </div>

          {/* Desktop Navigasyon Menüsü */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Kullanıcı Bilgileri ve Dropdown */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-800 rounded-lg transition-colors"
            >
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.role || 'Yönetici'}
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Dropdown Menü */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  <UserIcon className="w-4 h-4 mr-3" />
                  Profil
                </Link>
                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    logout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Çıkış
                </button>
              </div>
            )}
          </div>

          {/* Mobil Hamburger Menü Butonu */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobil Kullanıcı Bilgileri */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.role || 'Yönetici'}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Mobil Navigasyon Menüsü */}
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobil Profil ve Çıkış */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    logout();
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Çıkış</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
