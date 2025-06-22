import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ProfileList from './components/ProfileList';
import ProfileForm from './components/ProfileForm';
import Calendar from './components/Calendar';
import SearchProfiles from './components/SearchProfiles';
import { Profile } from './types';

function AppContent() {
  const { state, dispatch } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Calculer les notifications du jour
  const today = new Date().toISOString().split('T')[0];
  const todayNotifications = state.rendezVous.filter(rdv => 
    rdv.date === today && rdv.statut === 'prevu'
  );

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    setCurrentPage('edit-profile');
  };

  const handleSaveProfile = () => {
    setCurrentPage('profiles');
    setEditingProfile(null);
  };

  const handleCancelEdit = () => {
    setCurrentPage('profiles');
    setEditingProfile(null);
  };

  const handlePageChange = (page: string) => {
    if (page === 'add-profile') {
      setEditingProfile(null);
      setCurrentPage('add-profile');
    } else {
      setCurrentPage(page);
    }
  };

  // Gestion des profils sélectionnés pour édition
  React.useEffect(() => {
    if (state.selectedProfile && currentPage === 'profiles') {
      handleEditProfile(state.selectedProfile);
      dispatch({ type: 'SET_SELECTED_PROFILE', payload: null });
    }
  }, [state.selectedProfile, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'profiles':
        return <ProfileList />;
      
      case 'add-profile':
      case 'edit-profile':
        return (
          <ProfileForm
            editingProfile={editingProfile}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        );
      
      case 'calendar':
        return <Calendar />;
      
      case 'search':
        return <SearchProfiles />;
      
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">⚙️ Paramètres</h1>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mode d'interface</h3>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={state.designMode === 'form'}
                          onChange={() => dispatch({ type: 'SET_DESIGN_MODE', payload: 'form' })}
                          className="mr-2"
                        />
                        Formulaire classique
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={state.designMode === 'bubbles'}
                          onChange={() => dispatch({ type: 'SET_DESIGN_MODE', payload: 'bubbles' })}
                          className="mr-2"
                        />
                        Interface à bulles
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Statistiques de l'application</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{state.profiles.length}</div>
                        <div className="text-sm text-gray-600">Profils enregistrés</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{state.rendezVous.length}</div>
                        <div className="text-sm text-gray-600">Rendez-vous planifiés</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {state.rendezVous.filter(rdv => rdv.statut === 'realise').length}
                        </div>
                        <div className="text-sm text-gray-600">Rencontres réalisées</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        notifications={todayNotifications}
      />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;