import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { SearchCriteria, Profile } from '../types';
import { Search, Filter, User, MapPin, Heart, ToggleLeft, ToggleRight } from 'lucide-react';

interface BubbleProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  color: string;
}

function Bubble({ children, selected, onClick, color }: BubbleProps) {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2 min-w-[100px] text-center";
  const colorClasses = {
    blue: selected 
      ? "bg-blue-500 text-white border-blue-500 shadow-lg scale-105" 
      : "bg-white text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50",
    green: selected 
      ? "bg-green-500 text-white border-green-500 shadow-lg scale-105" 
      : "bg-white text-green-600 border-green-300 hover:border-green-400 hover:bg-green-50",
    purple: selected 
      ? "bg-purple-500 text-white border-purple-500 shadow-lg scale-105" 
      : "bg-white text-purple-600 border-purple-300 hover:border-purple-400 hover:bg-purple-50",
    pink: selected 
      ? "bg-pink-500 text-white border-pink-500 shadow-lg scale-105" 
      : "bg-white text-pink-600 border-pink-300 hover:border-pink-400 hover:bg-pink-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${colorClasses[color as keyof typeof colorClasses]}`}
    >
      {children}
    </button>
  );
}

export default function SearchProfiles() {
  const { state } = useApp();
  const [searchMode, setSearchMode] = useState<'form' | 'bubbles'>('form');
  const [criteria, setCriteria] = useState<SearchCriteria>({});
  const [results, setResults] = useState<Profile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  const searchProfiles = () => {
    const filtered = state.profiles.filter(profile => {
      const age = calculateAge(profile.dateNaissance);
      
      // Filtres d'âge
      if (criteria.ageMin && age < criteria.ageMin) return false;
      if (criteria.ageMax && age > criteria.ageMax) return false;
      
      // Filtre de genre
      if (criteria.genre && profile.genre !== criteria.genre) return false;
      
      // Filtre d'origine
      if (criteria.origine && criteria.origine !== 'indifferent' && profile.origine !== criteria.origine) return false;
      
      // Filtre de courant religieux
      if (criteria.courantReligieux && criteria.courantReligieux.length > 0) {
        if (!criteria.courantReligieux.includes(profile.courantReligieux)) return false;
      }
      
      // Filtre de ville
      if (criteria.ville && !profile.villeNaissance.toLowerCase().includes(criteria.ville.toLowerCase())) return false;
      
      // Filtre Alya
      if (criteria.alya !== undefined && profile.alya !== criteria.alya) return false;
      
      // Filtre taille
      if (criteria.taille) {
        if (profile.taille < criteria.taille.min || profile.taille > criteria.taille.max) return false;
      }
      
      // Filtre barbe (pour hommes)
      if (criteria.barbe !== undefined && profile.genre === 'homme' && profile.barbe !== criteria.barbe) return false;
      
      // Filtre fumeur
      if (criteria.fume !== undefined && profile.fume !== criteria.fume) return false;
      
      // Filtre armée (pour dati)
      if (criteria.armee !== undefined && profile.courantReligieux === 'dati' && profile.armee !== criteria.armee) return false;
      
      // Filtre téléphone
      if (criteria.telephone && profile.telephone.type !== criteria.telephone) return false;
      
      // Filtre films
      if (criteria.films !== undefined && profile.films !== criteria.films) return false;
      
      // Filtre réseaux sociaux
      if (criteria.reseauxSociaux !== undefined && profile.reseauxSociaux.utilise !== criteria.reseauxSociaux) return false;
      
      return true;
    });
    
    setResults(filtered);
    setHasSearched(true);
  };

  const resetSearch = () => {
    setCriteria({});
    setResults([]);
    setHasSearched(false);
  };

  const renderFormMode = () => (
    <div className="space-y-6">
      {/* Critères de base */}
      <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
        <h3 className="text-lg font-bold text-blue-800 mb-4">👤 Critères de Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <select
              value={criteria.genre || ''}
              onChange={(e) => setCriteria(prev => ({ ...prev, genre: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Indifférent</option>
              <option value="homme">👨 Homme</option>
              <option value="femme">👩 Femme</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Âge minimum</label>
            <input
              type="number"
              value={criteria.ageMin || ''}
              onChange={(e) => setCriteria(prev => ({ ...prev, ageMin: parseInt(e.target.value) || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="18"
              max="80"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Âge maximum</label>
            <input
              type="number"
              value={criteria.ageMax || ''}
              onChange={(e) => setCriteria(prev => ({ ...prev, ageMax: parseInt(e.target.value) || undefined }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="18"
              max="80"
            />
          </div>
        </div>
      </div>

      {/* Origine et Religion */}
      <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400">
        <h3 className="text-lg font-bold text-purple-800 mb-4">🕯️ Origine et Religion</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Origine</label>
            <select
              value={criteria.origine || ''}
              onChange={(e) => setCriteria(prev => ({ ...prev, origine: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Indifférent</option>
              <option value="sefarade">🌍 Séfarade</option>
              <option value="ashkenaze">🌎 Ashkénaze</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Courant religieux</label>
            <div className="space-y-2">
              {['dati', 'haredi', 'habad'].map(courant => (
                <label key={courant} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={criteria.courantReligieux?.includes(courant) || false}
                    onChange={(e) => {
                      const current = criteria.courantReligieux || [];
                      if (e.target.checked) {
                        setCriteria(prev => ({ ...prev, courantReligieux: [...current, courant] }));
                      } else {
                        setCriteria(prev => ({ ...prev, courantReligieux: current.filter(c => c !== courant) }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="capitalize">{courant}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Critères physiques */}
      <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
        <h3 className="text-lg font-bold text-green-800 mb-4">👁️ Critères Physiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taille minimum (cm)</label>
            <input
              type="number"
              value={criteria.taille?.min || ''}
              onChange={(e) => setCriteria(prev => ({ 
                ...prev, 
                taille: { ...prev.taille, min: parseInt(e.target.value) || 140, max: prev.taille?.max || 220 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="140"
              max="220"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taille maximum (cm)</label>
            <input
              type="number"
              value={criteria.taille?.max || ''}
              onChange={(e) => setCriteria(prev => ({ 
                ...prev, 
                taille: { min: prev.taille?.min || 140, max: parseInt(e.target.value) || 220 }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              min="140"
              max="220"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBubbleMode = () => (
    <div className="space-y-8">
      {/* Genre */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vous recherchez :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={criteria.genre === 'homme'}
            onClick={() => setCriteria(prev => ({ ...prev, genre: prev.genre === 'homme' ? undefined : 'homme' }))}
            color="blue"
          >
            👨 Homme
          </Bubble>
          <Bubble
            selected={criteria.genre === 'femme'}
            onClick={() => setCriteria(prev => ({ ...prev, genre: prev.genre === 'femme' ? undefined : 'femme' }))}
            color="pink"
          >
            👩 Femme
          </Bubble>
        </div>
      </div>

      {/* Origine */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Origine :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={criteria.origine === 'sefarade'}
            onClick={() => setCriteria(prev => ({ ...prev, origine: prev.origine === 'sefarade' ? undefined : 'sefarade' }))}
            color="green"
          >
            🌍 Séfarade
          </Bubble>
          <Bubble
            selected={criteria.origine === 'ashkenaze'}
            onClick={() => setCriteria(prev => ({ ...prev, origine: prev.origine === 'ashkenaze' ? undefined : 'ashkenaze' }))}
            color="green"
          >
            🌎 Ashkénaze
          </Bubble>
        </div>
      </div>

      {/* Courant religieux */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Courant religieux :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={criteria.courantReligieux?.includes('dati') || false}
            onClick={() => {
              const current = criteria.courantReligieux || [];
              const updated = current.includes('dati') 
                ? current.filter(c => c !== 'dati')
                : [...current, 'dati'];
              setCriteria(prev => ({ ...prev, courantReligieux: updated }));
            }}
            color="purple"
          >
            📚 Dati
          </Bubble>
          <Bubble
            selected={criteria.courantReligieux?.includes('haredi') || false}
            onClick={() => {
              const current = criteria.courantReligieux || [];
              const updated = current.includes('haredi') 
                ? current.filter(c => c !== 'haredi')
                : [...current, 'haredi'];
              setCriteria(prev => ({ ...prev, courantReligieux: updated }));
            }}
            color="purple"
          >
            🎩 Haredi
          </Bubble>
          <Bubble
            selected={criteria.courantReligieux?.includes('habad') || false}
            onClick={() => {
              const current = criteria.courantReligieux || [];
              const updated = current.includes('habad') 
                ? current.filter(c => c !== 'habad')
                : [...current, 'habad'];
              setCriteria(prev => ({ ...prev, courantReligieux: updated }));
            }}
            color="purple"
          >
            👑 Habad
          </Bubble>
        </div>
      </div>

      {/* Âge */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tranche d'âge :</h3>
        <div className="flex gap-4 justify-center items-center">
          <input
            type="number"
            value={criteria.ageMin || ''}
            onChange={(e) => setCriteria(prev => ({ ...prev, ageMin: parseInt(e.target.value) || undefined }))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
            placeholder="Min"
            min="18"
            max="80"
          />
          <span className="text-gray-500">à</span>
          <input
            type="number"
            value={criteria.ageMax || ''}
            onChange={(e) => setCriteria(prev => ({ ...prev, ageMax: parseInt(e.target.value) || undefined }))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
            placeholder="Max"
            min="18"
            max="80"
          />
          <span className="text-gray-500">ans</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Search className="text-blue-600 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">🔍 Recherche de Profils</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Formulaire</span>
                <button
                  onClick={() => setSearchMode(searchMode === 'form' ? 'bubbles' : 'form')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {searchMode === 'form' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </button>
                <span className="text-sm text-gray-600">Bulles</span>
              </div>
            </div>
          </div>

          {/* Interface de recherche */}
          {searchMode === 'form' ? renderFormMode() : renderBubbleMode()}

          {/* Actions */}
          <div className="flex justify-center space-x-4 mt-8 pt-6 border-t">
            <button
              onClick={resetSearch}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Réinitialiser
            </button>
            
            <button
              onClick={searchProfiles}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search size={20} className="mr-2" />
              Rechercher
            </button>
          </div>
        </div>

        {/* Résultats */}
        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Filter className="text-green-600 mr-3" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">
                Résultats de la recherche ({results.length} profil{results.length > 1 ? 's' : ''})
              </h2>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12">
                <User size={64} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun profil ne correspond à vos critères</p>
                <p className="text-gray-400">Essayez d'élargir vos critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(profile => (
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
                            {profile.alya && <span className="ml-2">🇮🇱</span>}
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-3">
                            <span className="mr-2">🕯️</span>
                            <span className="capitalize">{profile.courantReligieux}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{profile.origine}</span>
                          </div>
                          
                          <div className="flex items-center text-gray-600 mb-3">
                            <span className="mr-2">📏</span>
                            <span>{profile.taille} cm</span>
                            {profile.genre === 'homme' && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{profile.barbe ? '🧔 Barbe' : '😊 Sans barbe'}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {profile.fume ? '🚬 Fumeur' : '🚫 Non-fumeur'}
                            </span>
                            {profile.telephone.possede && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                📱 {profile.telephone.type}
                              </span>
                            )}
                            {profile.films && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                🎬 Films
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}