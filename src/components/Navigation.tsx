import React from 'react';
import { Users, Calendar, Search, Plus, Settings, Bell } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  notifications: any[];
}

export default function Navigation({ currentPage, onPageChange, notifications }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Bell, hasNotif: notifications.length > 0 },
    { id: 'profiles', label: 'Profils', icon: Users },
    { id: 'add-profile', label: 'Nouveau Profil', icon: Plus },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'search', label: 'Recherche', icon: Search },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-blue-600">💙 Shidduch Manager</h1>
          <div className="flex space-x-6">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.hasNotif && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}