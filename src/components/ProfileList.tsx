import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Edit, Trash2, User, Calendar, MapPin, Heart } from 'lucide-react';

export default function ProfileList() {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = state.profiles.filter(profile =>
    profile.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.villeNaissance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateNaissance: string) => {
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getRendezVousCount = (profileId: string) => {
    return state.rendezVous.filter(rdv => 
      (rdv.personne1Id === profileId || rdv.personne2Id === profileId) && 
      rdv.statut === 'realise'
    ).length;
  };

  const handleDelete = (profileId: string, profileName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil de ${profileName} ?`)) {
      dispatch({ type: 'DELETE_PROFILE', payload: profileId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">👥 Gestion des Profils</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">
                {filteredProfiles.length} profil{filteredProfiles.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12">
              <User size={64} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'Aucun profil trouvé pour cette recherche' : 'Aucun profil enregistré'}
              </p>
              <p className="text-gray-400">
                {!searchTerm && 'Commencez par créer votre premier profil !'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map(profile => (
                <div key={profile.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  <div className={`h-2 ${profile.genre === 'homme' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {profile.prenom} {profile.nom}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <User size={16} className="mr-2" />
                          <span>{calculateAge(profile.dateNaissance)} ans</span>
                          <span className="mx-2">•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            profile.genre === 'homme' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {profile.genre === 'homme' ? '👨' : '👩'} {profile.genre}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin size={16} className="mr-2" />
                          <span>{profile.villeNaissance}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <span className="mr-2">🕯️</span>
                          <span className="capitalize">{profile.courantReligieux}</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{profile.origine}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{getRendezVousCount(profile.id)} RDV</span>
                          </div>
                          <div className="flex items-center">
                            <Heart size={14} className="mr-1" />
                            <span>{profile.historique.length} entrées</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Critères principaux */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Recherche:</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {profile.criteres.ageMin}-{profile.criteres.ageMax} ans
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
                          {profile.criteres.origine}
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_SELECTED_PROFILE', payload: profile });
                          // Navigation vers la page d'édition serait gérée par le parent
                        }}
                        className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      >
                        <Edit size={16} className="mr-2" />
                        Modifier
                      </button>
                      
                      <button
                        onClick={() => handleDelete(profile.id, `${profile.prenom} ${profile.nom}`)}
                        className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}