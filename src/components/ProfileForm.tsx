import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Profile } from '../types';
import { Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import BubbleInterface from './BubbleInterface';

const emptyProfile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'> = {
  prenom: '',
  nom: '',
  dateNaissance: '',
  villeNaissance: '',
  alya: false,
  dateAlya: '',
  genre: 'homme',
  formationProfessionnelle: '',
  etudes: '',
  travailActuel: '',
  statutParents: 'vivent',
  parentsConverti: false,
  parentsdivorce: false,
  nombreEnfantsParents: 0,
  prenomPerefrancais: '',
  prenomPerehebreu: '',
  prenomMerefrancais: '',
  prenomMerehebreu: '',
  nomJeuneFillleMere: '',
  nombreFreresSoeurs: 0,
  origine: 'sefarade',
  paysOrigine: [],
  taille: 170,
  barbe: false,
  couleurPeau: '',
  gros: false,
  photoProfile: '',
  partagePhoto: 'unique',
  partageProfil: true,
  hobbies: [],
  parcours: {
    formations: []
  },
  midot: [],
  telephone: {
    possede: true,
    type: 'normal'
  },
  films: false,
  reseauxSociaux: {
    utilise: false,
    lesquels: []
  },
  television: false,
  fume: false,
  problemeSante: {
    actuel: false,
    passe: false
  },
  courantReligieux: 'dati',
  couvreCheveux: {
    oui: false
  },
  criteres: {
    ageMin: 18,
    ageMax: 35,
    origine: 'indifferent',
    courantReligieux: [],
    autresCriteres: []
  },
  historique: [],
  notes: {}
};

interface ProfileFormProps {
  editingProfile?: Profile | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileForm({ editingProfile, onSave, onCancel }: ProfileFormProps) {
  const { state, dispatch } = useApp();
  const [profile, setProfile] = useState<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>(
    editingProfile ? { ...editingProfile } : emptyProfile
  );
  const [currentHobby, setCurrentHobby] = useState('');
  const [currentMidah, setCurrentMidah] = useState('');

  useEffect(() => {
    if (editingProfile) {
      setProfile({ ...editingProfile });
    }
  }, [editingProfile]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!profile.prenom || !profile.nom || !profile.dateNaissance) {
      alert('Veuillez remplir au minimum le prénom, nom et date de naissance.');
      return;
    }

    const now = new Date().toISOString();
    const newProfile: Profile = {
      ...profile,
      id: editingProfile?.id || Date.now().toString(),
      createdAt: editingProfile?.createdAt || now,
      updatedAt: now
    };

    if (editingProfile) {
      dispatch({ type: 'UPDATE_PROFILE', payload: newProfile });
    } else {
      dispatch({ type: 'ADD_PROFILE', payload: newProfile });
    }
    
    onSave();
  };

  const handleModeToggle = () => {
    const newMode = state.designMode === 'form' ? 'bubbles' : 'form';
    dispatch({ type: 'SET_DESIGN_MODE', payload: newMode });
  };

  const addHobby = () => {
    if (currentHobby.trim()) {
      setProfile(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, currentHobby.trim()]
      }));
      setCurrentHobby('');
    }
  };

  const removeHobby = (index: number) => {
    setProfile(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  const addMidah = () => {
    if (currentMidah.trim()) {
      setProfile(prev => ({
        ...prev,
        midot: [...prev.midot, currentMidah.trim()]
      }));
      setCurrentMidah('');
    }
  };

  const removeMidah = (index: number) => {
    setProfile(prev => ({
      ...prev,
      midot: prev.midot.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {editingProfile ? '✏️ Modifier le Profil' : '➕ Nouveau Profil'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Mode Formulaire</span>
                <button
                  type="button"
                  onClick={handleModeToggle}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {state.designMode === 'form' ? <ToggleLeft size={24} /> : <ToggleRight size={24} />}
                </button>
                <span className="text-sm text-gray-600">Mode Bulles</span>
              </div>
              
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {state.designMode === 'bubbles' ? (
            <BubbleInterface
              profile={profile}
              setProfile={setProfile}
              onSave={handleSubmit}
              onCancel={onCancel}
              editingProfile={editingProfile}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Genre - Always first */}
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                <h2 className="text-xl font-bold text-blue-800 mb-4">👤 Genre</h2>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ 
                      ...prev, 
                      genre: 'homme',
                      // Reset femme-specific fields
                      couvreCheveux: { oui: false },
                      collants: false,
                      manchesCourtes: false
                    }))}
                    className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ${
                      profile.genre === 'homme'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-400'
                    }`}
                  >
                    👨 Homme
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ 
                      ...prev, 
                      genre: 'femme',
                      // Reset homme-specific fields
                      etudeTorahNiveau: undefined,
                      barbe: undefined
                    }))}
                    className={`px-6 py-3 rounded-full text-lg font-medium transition-all duration-200 ${
                      profile.genre === 'femme'
                        ? 'bg-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white text-pink-600 border-2 border-pink-300 hover:border-pink-400'
                    }`}
                  >
                    👩 Femme
                  </button>
                </div>
              </div>

              {/* Rest of the form with conditional rendering based on gender */}
              {profile.genre && (
                <>
                  {/* Basic Info */}
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                    <h2 className="text-xl font-bold text-blue-800 mb-4">👤 Informations de Base</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                        <input
                          type="text"
                          value={profile.prenom}
                          onChange={(e) => setProfile(prev => ({ ...prev, prenom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                        <input
                          type="text"
                          value={profile.nom}
                          onChange={(e) => setProfile(prev => ({ ...prev, nom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                        <input
                          type="date"
                          value={profile.dateNaissance}
                          onChange={(e) => setProfile(prev => ({ ...prev, dateNaissance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville de naissance</label>
                        <input
                          type="text"
                          value={profile.villeNaissance}
                          onChange={(e) => setProfile(prev => ({ ...prev, villeNaissance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profile.alya}
                            onChange={(e) => setProfile(prev => ({ ...prev, alya: e.target.checked }))}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">🇮🇱 A fait son Alya</span>
                        </label>
                        
                        {profile.alya && (
                          <input
                            type="date"
                            value={profile.dateAlya || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, dateAlya: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Date d'Alya"
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">💬 Notes générales</label>
                      <textarea
                        value={profile.notes.general || ''}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          notes: { ...prev.notes, general: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Notes générales sur cette personne..."
                      />
                    </div>
                  </div>

                  {/* Hobbies */}
                  <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400">
                    <h2 className="text-xl font-bold text-purple-800 mb-4">🎯 Hobbies et Passions</h2>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={currentHobby}
                        onChange={(e) => setCurrentHobby(e.target.value)}
                        placeholder="Ajouter un hobby..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
                      />
                      <button
                        type="button"
                        onClick={addHobby}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {profile.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center"
                        >
                          {hobby}
                          <button
                            type="button"
                            onClick={() => removeHobby(index)}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Parcours */}
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
                    <h2 className="text-xl font-bold text-green-800 mb-4">🎓 Parcours et Formation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">École</label>
                        <input
                          type="text"
                          value={profile.parcours.ecole || ''}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            parcours: { ...prev.parcours, ecole: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeshiva Ketana</label>
                        <input
                          type="text"
                          value={profile.parcours.yeshivaKetana || ''}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            parcours: { ...prev.parcours, yeshivaKetana: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Études Universitaires</label>
                        <input
                          type="text"
                          value={profile.parcours.etudesUniversitaires || ''}
                          onChange={(e) => setProfile(prev => ({
                            ...prev,
                            parcours: { ...prev.parcours, etudesUniversitaires: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeshiva Guedola / Séminaire</label>
                        <input
                          type="text"
                          value={profile.parcours.yeshivaGuedola || profile.parcours.seminaire || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setProfile(prev => ({
                              ...prev,
                              parcours: profile.genre === 'homme' 
                                ? { ...prev.parcours, yeshivaGuedola: value }
                                : { ...prev.parcours, seminaire: value }
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder={profile.genre === 'homme' ? 'Yeshiva Guedola' : 'Séminaire'}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formation Professionnelle</label>
                        <input
                          type="text"
                          value={profile.formationProfessionnelle}
                          onChange={(e) => setProfile(prev => ({ ...prev, formationProfessionnelle: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travail Actuel</label>
                        <input
                          type="text"
                          value={profile.travailActuel}
                          onChange={(e) => setProfile(prev => ({ ...prev, travailActuel: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Midot */}
                  <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4">✨ Midot (Traits de Caractère)</h2>
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={currentMidah}
                        onChange={(e) => setCurrentMidah(e.target.value)}
                        placeholder="Ajouter une midah..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMidah())}
                      />
                      <button
                        type="button"
                        onClick={addMidah}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {profile.midot.map((midah, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm flex items-center"
                        >
                          {midah}
                          <button
                            type="button"
                            onClick={() => removeMidah(index)}
                            className="ml-2 text-yellow-600 hover:text-yellow-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Religion */}
                  <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400">
                    <h2 className="text-xl font-bold text-purple-800 mb-4">🕯️ Religion</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Common religious fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Courant Religieux</label>
                        <select
                          value={profile.courantReligieux}
                          onChange={(e) => setProfile(prev => ({ 
                            ...prev, 
                            courantReligieux: e.target.value as 'dati' | 'haredi' | 'habad'
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="dati">Dati</option>
                          <option value="haredi">Haredi</option>
                          <option value="habad">Habad</option>
                        </select>
                      </div>

                      {/* Gender-specific religious fields */}
                      {profile.genre === 'homme' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude de la Torah</label>
                          <select
                            value={profile.etudeTorahNiveau || ''}
                            onChange={(e) => setProfile(prev => ({
                              ...prev,
                              etudeTorahNiveau: e.target.value ? parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 : undefined
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Choisir un niveau</option>
                            <option value="1">Niveau 1 - Débutant</option>
                            <option value="2">Niveau 2 - Intermédiaire</option>
                            <option value="3">Niveau 3 - Avancé</option>
                            <option value="4">Niveau 4 - Expert</option>
                            <option value="5">Niveau 5 - Maître</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tenue vestimentaire</label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={profile.couvreCheveux.oui}
                                  onChange={(e) => setProfile(prev => ({
                                    ...prev,
                                    couvreCheveux: {
                                      oui: e.target.checked,
                                      type: e.target.checked ? (prev.couvreCheveux.type || 'foulard') : undefined
                                    }
                                  }))}
                                  className="mr-2"
                                />
                                Couvre les cheveux
                              </label>
                              
                              {profile.couvreCheveux.oui && (
                                <select
                                  value={profile.couvreCheveux.type || 'foulard'}
                                  onChange={(e) => setProfile(prev => ({
                                    ...prev,
                                    couvreCheveux: {
                                      oui: true,
                                      type: e.target.value as 'foulard' | 'perruque'
                                    }
                                  }))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                >
                                  <option value="foulard">Foulard</option>
                                  <option value="perruque">Perruque</option>
                                </select>
                              )}
                              
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={profile.collants || false}
                                  onChange={(e) => setProfile(prev => ({
                                    ...prev,
                                    collants: e.target.checked
                                  }))}
                                  className="mr-2"
                                />
                                Porte des collants
                              </label>
                              
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={profile.manchesCourtes || false}
                                  onChange={(e) => setProfile(prev => ({
                                    ...prev,
                                    manchesCourtes: e.target.checked
                                  }))}
                                  className="mr-2"
                                />
                                Porte des manches courtes
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save size={20} className="mr-2" />
                  {editingProfile ? 'Mettre à jour' : 'Créer le profil'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}