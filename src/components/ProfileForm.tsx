import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Profile } from '../types';
import { Save, X, ToggleLeft, ToggleRight } from 'lucide-react';
import BubbleInterface from './BubbleInterface';

const emptyProfile: Omit<Profile, 'id'> = {
  prenom: '',
  nom: '',
  dateNaissance: '',
  paysNaissance: '',
  villeNaissance: '',
  paysResidence: '',
  alya: false,
  dateAlya: '',
  genre: 'homme' as 'homme' | 'femme',
  photoProfile: '',
  partagePhoto: 'unique',
  partageProfil: true,
  
  // Origine
  origine: 'sefarade',
  paysOrigine: [],
  
  // Parcours et formation
  aBac: false,
  ecoles: [],
  yeshivaKetana: [],
  yeshivaGuedola: [],
  seminaire: [],
  formationProfessionnelle: '',
  domaineEtudes: '',
  universite: [],
  
  // Travail
  travailActuel: '',
  lieuTravail: '',
  
  // Hobbies
  hobbies: [],
  
  // Apparence
  taille: 170,
  couleurYeux: '',
  couleurPeau: '',
  couleurCheveux: '',
  cheveuxLongs: false,
  gros: false,
  
  // Homme spécifique
  barbe: false,
  typeBarbier: 'rase',
  
  // Midot
  midot: [],
  
  // Religion
  courantReligieux: 'dati',
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
  
  // Femme spécifique
  couvreCheveux: {
    oui: false
  },
  collants: false,
  jupeOuPantalon: 'jupe',
  manchesCourtes: false,
  
  // Famille
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
  
  // Santé
  fume: false,
  problemeSante: {
    actuel: false,
    passe: false
  },
  
  // Ancien format (à conserver pour compatibilité)
  parcours: {
    formations: []
  },
  
  // Critères
  criteres: {
    ageMin: 18,
    ageMax: 35,
    origine: 'indifferent',
    courantReligieux: [],
    autresCriteres: []
  },
  
  // Historique et notes
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
  const [profile, setProfile] = useState<Omit<Profile, 'id'>>(() => {
    if (editingProfile) {
      // Convertir l'objet Profile en Omit<Profile, 'id'>
      const { id, ...rest } = editingProfile;
      return rest;
    }
    return emptyProfile;
  });
  const [currentHobby, setCurrentHobby] = useState('');
  const [currentMidah, setCurrentMidah] = useState('');
  const [useBubbleInterface, setUseBubbleInterface] = useState(state.designMode === 'bubbles');

  useEffect(() => {
    if (editingProfile) {
      setProfile({ ...editingProfile });
    }
  }, [editingProfile]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validation
    if (!profile.prenom || !profile.nom || !profile.dateNaissance) {
      alert('Veuillez remplir tous les champs obligatoires (prénom, nom, date de naissance).');
      return;
    }
    
    onSave();
  };

  const handleModeToggle = () => {
    const newMode = state.designMode === 'form' ? 'bubbles' : 'form';
    dispatch({ type: 'SET_DESIGN_MODE', payload: newMode });
    setUseBubbleInterface(newMode === 'bubbles');
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
                  onClick={() => setUseBubbleInterface(!useBubbleInterface)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {useBubbleInterface ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
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

          {useBubbleInterface ? (
            <BubbleInterface
              profile={profile}
              setProfile={setProfile}
              onSave={handleSubmit}
              onCancel={onCancel}
              editingProfile={editingProfile}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Gender Selection */}
              <div className="bg-gray-100 p-6 rounded-xl border-l-4 border-gray-400 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">👤 Genre</h2>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, genre: 'homme' }))}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                      profile.genre === 'homme'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    👨 Garçon
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, genre: 'femme' }))}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium text-center transition-colors ${
                      profile.genre === 'femme'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    👩 Fille
                  </button>
                </div>
              </div>

              {profile.genre && (
                <>
                  {/* Basic Info */}
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
                    <h2 className="text-xl font-bold text-blue-800 mb-4">👤 Informations de Base</h2>
                    
                    {/* Photo Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {profile.photoProfile ? (
                            <img 
                              src={profile.photoProfile} 
                              alt="Photo de profil" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <span className="text-3xl">📷</span>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfile(prev => ({ ...prev, photoProfile: reader.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                    
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays de naissance</label>
                        <input
                          type="text"
                          value={profile.paysNaissance || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, paysNaissance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Commencez à taper..."
                          list="pays-list"
                        />
                        <datalist id="pays-list">
                          <option value="France" />
                          <option value="Israël" />
                          <option value="États-Unis" />
                          <option value="Canada" />
                          <option value="Belgique" />
                          <option value="Suisse" />
                          <option value="Maroc" />
                          <option value="Tunisie" />
                          <option value="Algérie" />
                        </datalist>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville de naissance</label>
                        <input
                          type="text"
                          value={profile.villeNaissance}
                          onChange={(e) => setProfile(prev => ({ ...prev, villeNaissance: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Commencez à taper..."
                          list="villes-list"
                        />
                        <datalist id="villes-list">
                          <option value="Paris" />
                          <option value="Jérusalem" />
                          <option value="Tel Aviv" />
                          <option value="Netanya" />
                          <option value="Ashdod" />
                          <option value="Marseille" />
                          <option value="Lyon" />
                          <option value="Strasbourg" />
                          <option value="Nice" />
                        </datalist>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pays de résidence</label>
                        <input
                          type="text"
                          value={profile.paysResidence || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, paysResidence: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Commencez à taper..."
                          list="pays-list"
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
                    
                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Origine</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Origine</label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.origine === 'sefarade'}
                                onChange={() => setProfile(prev => ({ ...prev, origine: 'sefarade' }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Séfarade</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.origine === 'ashkenaze'}
                                onChange={() => setProfile(prev => ({ ...prev, origine: 'ashkenaze' }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Ashkénaze</span>
                            </label>
                          </div>
                        </div>
                        
                        {profile.origine === 'sefarade' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pays d'origine</label>
                            <div className="flex flex-wrap gap-2">
                              {['tunisie', 'algerie', 'maroc'].map(pays => (
                                <label key={pays} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={profile.paysOrigine?.includes(pays as any) || false}
                                    onChange={(e) => {
                                      const current = profile.paysOrigine || [];
                                      const updated = e.target.checked
                                        ? [...current, pays as any]
                                        : current.filter(p => p !== pays);
                                      setProfile(prev => ({ ...prev, paysOrigine: updated }));
                                    }}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">
                                    {pays === 'tunisie' && '🇹🇳 Tunisie'}
                                    {pays === 'algerie' && '🇩🇿 Algérie'}
                                    {pays === 'maroc' && '🇲🇦 Maroc'}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-md font-semibold text-gray-700 mb-2">Partage du profil</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Partage de la photo</label>
                          <select
                            value={profile.partagePhoto}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              partagePhoto: e.target.value as 'unique' | 'multiple' | 'non'
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="unique">Vue unique</option>
                            <option value="multiple">Vue multiple</option>
                            <option value="non">Ne pas partager</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Partage du profil complet</label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.partageProfil === true}
                                onChange={() => setProfile(prev => ({ ...prev, partageProfil: true }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Oui</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.partageProfil === false}
                                onChange={() => setProfile(prev => ({ ...prev, partageProfil: false }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Non</span>
                            </label>
                          </div>
                        </div>
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
                  <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
                    <h2 className="text-xl font-bold text-yellow-800 mb-4">🎯 Hobbies et Passions</h2>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.hobbies.map((hobby, index) => (
                          <div 
                            key={index} 
                            className="bg-yellow-100 px-3 py-1 rounded-full flex items-center"
                          >
                            <span className="mr-2">{hobby}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newHobbies = [...profile.hobbies];
                                newHobbies.splice(index, 1);
                                setProfile(prev => ({ ...prev, hobbies: newHobbies }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentHobby}
                          onChange={(e) => setCurrentHobby(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentHobby.trim()) {
                              e.preventDefault();
                              setProfile(prev => ({
                                ...prev,
                                hobbies: [...prev.hobbies, currentHobby.trim()]
                              }));
                              setCurrentHobby('');
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="Ajouter un hobby ou une passion..."
                          list="hobbies-list"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (currentHobby.trim()) {
                              setProfile(prev => ({
                                ...prev,
                                hobbies: [...prev.hobbies, currentHobby.trim()]
                              }));
                              setCurrentHobby('');
                            }
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                          Ajouter
                        </button>
                      </div>
                      
                      <datalist id="hobbies-list">
                        <option value="Lecture" />
                        <option value="Musique" />
                        <option value="Cinéma" />
                        <option value="Sport" />
                        <option value="Cuisine" />
                        <option value="Voyages" />
                        <option value="Photographie" />
                        <option value="Jardinage" />
                        <option value="Peinture" />
                        <option value="Danse" />
                      </datalist>
                    </div>
                  </div>

                  {/* Parcours */}
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
                    <h2 className="text-xl font-bold text-green-800 mb-4">🎓 Parcours et Formation</h2>
                    
                    {/* Bac */}
                    <div className="mb-6">
                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={profile.aBac || false}
                          onChange={(e) => setProfile(prev => ({ ...prev, aBac: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-md font-medium">A fait le bac</span>
                      </label>
                      
                      {profile.aBac && (
                        <div className="mt-2 pl-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">École</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.ecoles?.[0] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfile(prev => ({
                                  ...prev,
                                  ecoles: value ? [value, ...(prev.ecoles?.slice(1) || [])] : prev.ecoles?.slice(1) || []
                                }));
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Nom de l'école"
                              list="ecoles-list"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newEcoles = [...(profile.ecoles || []), ''];
                                setProfile(prev => ({ ...prev, ecoles: newEcoles }));
                              }}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              + Ajouter
                            </button>
                          </div>
                          
                          {/* Liste des écoles supplémentaires */}
                          {profile.ecoles && profile.ecoles.length > 1 && (
                            <div className="mt-2 space-y-2">
                              {profile.ecoles.slice(1).map((ecole, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={ecole}
                                    onChange={(e) => {
                                      const newEcoles = [...(profile.ecoles || [])];
                                      newEcoles[index + 1] = e.target.value;
                                      setProfile(prev => ({ ...prev, ecoles: newEcoles }));
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder={`École ${index + 2}`}
                                    list="ecoles-list"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEcoles = [...(profile.ecoles || [])];
                                      newEcoles.splice(index + 1, 1);
                                      setProfile(prev => ({ ...prev, ecoles: newEcoles }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <datalist id="ecoles-list">
                            <option value="Lycée Yabné" />
                            <option value="Lycée ORT" />
                            <option value="Lycée Alliance" />
                            <option value="Lycée Maïmonide" />
                            <option value="Lycée Yavné" />
                          </datalist>
                        </div>
                      )}
                    </div>
                    
                    {/* Formations spécifiques au genre */}
                    {profile.genre === 'homme' ? (
                      <>
                        {/* Yeshiva Ketana */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yeshiva Ketana</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.yeshivaKetana?.[0] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfile(prev => ({
                                  ...prev,
                                  yeshivaKetana: value ? [value, ...(prev.yeshivaKetana?.slice(1) || [])] : prev.yeshivaKetana?.slice(1) || []
                                }));
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Nom de la yeshiva ketana"
                              list="yeshiva-ketana-list"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newYeshivot = [...(profile.yeshivaKetana || []), ''];
                                setProfile(prev => ({ ...prev, yeshivaKetana: newYeshivot }));
                              }}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              + Ajouter
                            </button>
                          </div>
                          
                          {/* Liste des yeshivot ketanot supplémentaires */}
                          {profile.yeshivaKetana && profile.yeshivaKetana.length > 1 && (
                            <div className="mt-2 space-y-2">
                              {profile.yeshivaKetana.slice(1).map((yeshiva, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={yeshiva}
                                    onChange={(e) => {
                                      const newYeshivot = [...(profile.yeshivaKetana || [])];
                                      newYeshivot[index + 1] = e.target.value;
                                      setProfile(prev => ({ ...prev, yeshivaKetana: newYeshivot }));
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder={`Yeshiva ${index + 2}`}
                                    list="yeshiva-ketana-list"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newYeshivot = [...(profile.yeshivaKetana || [])];
                                      newYeshivot.splice(index + 1, 1);
                                      setProfile(prev => ({ ...prev, yeshivaKetana: newYeshivot }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <datalist id="yeshiva-ketana-list">
                            <option value="Yeshiva Ketana de Jérusalem" />
                            <option value="Yeshiva Ketana de Bnei Brak" />
                            <option value="Yeshiva Ketana de Paris" />
                          </datalist>
                        </div>
                        
                        {/* Yeshiva Guedola */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yeshiva Guedola</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.yeshivaGuedola?.[0] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfile(prev => ({
                                  ...prev,
                                  yeshivaGuedola: value ? [value, ...(prev.yeshivaGuedola?.slice(1) || [])] : prev.yeshivaGuedola?.slice(1) || []
                                }));
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Nom de la yeshiva guedola"
                              list="yeshiva-guedola-list"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newYeshivot = [...(profile.yeshivaGuedola || []), ''];
                                setProfile(prev => ({ ...prev, yeshivaGuedola: newYeshivot }));
                              }}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              + Ajouter
                            </button>
                          </div>
                          
                          {/* Liste des yeshivot guedolot supplémentaires */}
                          {profile.yeshivaGuedola && profile.yeshivaGuedola.length > 1 && (
                            <div className="mt-2 space-y-2">
                              {profile.yeshivaGuedola.slice(1).map((yeshiva, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={yeshiva}
                                    onChange={(e) => {
                                      const newYeshivot = [...(profile.yeshivaGuedola || [])];
                                      newYeshivot[index + 1] = e.target.value;
                                      setProfile(prev => ({ ...prev, yeshivaGuedola: newYeshivot }));
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder={`Yeshiva ${index + 2}`}
                                    list="yeshiva-guedola-list"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newYeshivot = [...(profile.yeshivaGuedola || [])];
                                      newYeshivot.splice(index + 1, 1);
                                      setProfile(prev => ({ ...prev, yeshivaGuedola: newYeshivot }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <datalist id="yeshiva-guedola-list">
                            <option value="Mir Yerushalayim" />
                            <option value="Ponevezh" />
                            <option value="Hevron" />
                            <option value="Brisk" />
                          </datalist>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Séminaire */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Séminaire</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={profile.seminaire?.[0] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProfile(prev => ({
                                  ...prev,
                                  seminaire: value ? [value, ...(prev.seminaire?.slice(1) || [])] : prev.seminaire?.slice(1) || []
                                }));
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Nom du séminaire"
                              list="seminaire-list"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSeminaires = [...(profile.seminaire || []), ''];
                                setProfile(prev => ({ ...prev, seminaire: newSeminaires }));
                              }}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              + Ajouter
                            </button>
                          </div>
                          
                          {/* Liste des séminaires supplémentaires */}
                          {profile.seminaire && profile.seminaire.length > 1 && (
                            <div className="mt-2 space-y-2">
                              {profile.seminaire.slice(1).map((sem, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={sem}
                                    onChange={(e) => {
                                      const newSeminaires = [...(profile.seminaire || [])];
                                      newSeminaires[index + 1] = e.target.value;
                                      setProfile(prev => ({ ...prev, seminaire: newSeminaires }));
                                    }}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder={`Séminaire ${index + 2}`}
                                    list="seminaire-list"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newSeminaires = [...(profile.seminaire || [])];
                                      newSeminaires.splice(index + 1, 1);
                                      setProfile(prev => ({ ...prev, seminaire: newSeminaires }));
                                    }}
                                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <datalist id="seminaire-list">
                            <option value="Beth Yaakov" />
                            <option value="Beth Rivkah" />
                            <option value="Beit Chana" />
                          </datalist>
                        </div>
                      </>
                    )}
                    
                    {/* Études */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Domaine d'études</label>
                        <input
                          type="text"
                          value={profile.domaineEtudes || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, domaineEtudes: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Ex: Informatique, Droit, Médecine..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Université</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={profile.universite?.[0] || ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setProfile(prev => ({
                                ...prev,
                                universite: value ? [value, ...(prev.universite?.slice(1) || [])] : prev.universite?.slice(1) || []
                              }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Nom de l'université"
                            list="universite-list"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newUniversites = [...(profile.universite || []), ''];
                              setProfile(prev => ({ ...prev, universite: newUniversites }));
                            }}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Liste des universités supplémentaires */}
                        {profile.universite && profile.universite.length > 1 && (
                          <div className="mt-2 space-y-2">
                            {profile.universite.slice(1).map((univ, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={univ}
                                  onChange={(e) => {
                                    const newUniversites = [...(profile.universite || [])];
                                    newUniversites[index + 1] = e.target.value;
                                    setProfile(prev => ({ ...prev, universite: newUniversites }));
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder={`Université ${index + 2}`}
                                  list="universite-list"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUniversites = [...(profile.universite || [])];
                                    newUniversites.splice(index + 1, 1);
                                    setProfile(prev => ({ ...prev, universite: newUniversites }));
                                  }}
                                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <datalist id="universite-list">
                          <option value="Université de Tel Aviv" />
                          <option value="Université Hébraïque de Jérusalem" />
                          <option value="Technion" />
                          <option value="Bar Ilan" />
                          <option value="Sorbonne" />
                          <option value="Paris Dauphine" />
                        </datalist>
                      </div>
                    </div>
                    
                    {/* Travail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Travail actuel</label>
                        <input
                          type="text"
                          value={profile.travailActuel}
                          onChange={(e) => setProfile(prev => ({ ...prev, travailActuel: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Poste ou profession"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de travail</label>
                        <input
                          type="text"
                          value={profile.lieuTravail || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, lieuTravail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Entreprise ou organisation"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formation professionnelle</label>
                        <input
                          type="text"
                          value={profile.formationProfessionnelle}
                          onChange={(e) => setProfile(prev => ({ ...prev, formationProfessionnelle: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Formations ou certifications professionnelles"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Midot */}
                  <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
                    <h2 className="text-xl font-bold text-red-800 mb-4">❤️ Midot</h2>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.midot.map((midah, index) => (
                          <div 
                            key={index} 
                            className="bg-red-100 px-3 py-1 rounded-full flex items-center"
                          >
                            <span className="mr-2">{midah}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newMidot = [...profile.midot];
                                newMidot.splice(index, 1);
                                setProfile(prev => ({ ...prev, midot: newMidot }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentMidah}
                          onChange={(e) => setCurrentMidah(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && currentMidah.trim()) {
                              e.preventDefault();
                              setProfile(prev => ({
                                ...prev,
                                midot: [...prev.midot, currentMidah.trim()]
                              }));
                              setCurrentMidah('');
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Ajouter une midah..."
                          list="midot-list"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (currentMidah.trim()) {
                              setProfile(prev => ({
                                ...prev,
                                midot: [...prev.midot, currentMidah.trim()]
                              }));
                              setCurrentMidah('');
                            }
                          }}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Ajouter
                        </button>
                      </div>
                      
                      <datalist id="midot-list">
                        <option value="Générosité" />
                        <option value="Patience" />
                        <option value="Humilité" />
                        <option value="Honnêteté" />
                        <option value="Empathie" />
                        <option value="Bienveillance" />
                        <option value="Respect" />
                        <option value="Modestie" />
                        <option value="Persévérance" />
                        <option value="Gratitude" />
                      </datalist>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <select
                          value={profile.telephone.possede ? (profile.telephone.type || 'normal') : 'non'}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'non') {
                              setProfile(prev => ({ ...prev, telephone: { possede: false } }));
                            } else {
                              setProfile(prev => ({ 
                                ...prev, 
                                telephone: { 
                                  possede: true, 
                                  type: value as 'casher-avec-internet' | 'casher-sans-internet' | 'normal'
                                } 
                              }));
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="non">Pas de téléphone</option>
                          <option value="casher-sans-internet">Casher sans internet</option>
                          <option value="casher-avec-internet">Casher avec internet</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Regarde des films</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.films === true}
                              onChange={() => setProfile(prev => ({ ...prev, films: true }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.films === false}
                              onChange={() => setProfile(prev => ({ ...prev, films: false }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Non</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Utilise les réseaux sociaux</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.reseauxSociaux.utilise === true}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                reseauxSociaux: { ...prev.reseauxSociaux, utilise: true } 
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.reseauxSociaux.utilise === false}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                reseauxSociaux: { ...prev.reseauxSociaux, utilise: false } 
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Non</span>
                          </label>
                        </div>
                        
                        {profile.reseauxSociaux.utilise && (
                          <div className="mt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lesquels ?</label>
                            <div className="flex flex-wrap gap-2">
                              {['Facebook', 'Instagram', 'Twitter', 'TikTok', 'LinkedIn'].map(reseau => (
                                <label key={reseau} className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                                  <input
                                    type="checkbox"
                                    checked={profile.reseauxSociaux.lesquels?.includes(reseau) || false}
                                    onChange={(e) => {
                                      const current = profile.reseauxSociaux.lesquels || [];
                                      const updated = e.target.checked
                                        ? [...current, reseau]
                                        : current.filter(r => r !== reseau);
                                      setProfile(prev => ({ 
                                        ...prev, 
                                        reseauxSociaux: { ...prev.reseauxSociaux, lesquels: updated } 
                                      }));
                                    }}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">{reseau}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
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
                            <option value="1">Cours le shabbat</option>
                            <option value="2">Cours dans la semaine</option>
                            <option value="3">Moments d'études fixes</option>
                            <option value="4">Mi-temps</option>
                            <option value="5">Plein temps</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Couverture des cheveux</label>
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  checked={profile.couvreCheveux.oui === true}
                                  onChange={() => setProfile(prev => ({ 
                                    ...prev, 
                                    couvreCheveux: { ...prev.couvreCheveux, oui: true } 
                                  }))}
                                  className="mr-2"
                                />
                                <span className="text-sm">Oui</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  checked={profile.couvreCheveux.oui === false}
                                  onChange={() => setProfile(prev => ({ 
                                    ...prev, 
                                    couvreCheveux: { ...prev.couvreCheveux, oui: false } 
                                  }))}
                                  className="mr-2"
                                />
                                <span className="text-sm">Non</span>
                              </label>
                            </div>
                            
                            {profile.couvreCheveux.oui && (
                              <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Type de couverture</label>
                                <div className="flex flex-wrap gap-2">
                                  {['foulard', 'perruque'].map(type => (
                                    <label key={type} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          typeof profile.couvreCheveux.type === 'string' 
                                            ? profile.couvreCheveux.type === type
                                            : profile.couvreCheveux.type?.includes(type) || false
                                        }
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setProfile(prev => ({ 
                                              ...prev, 
                                              couvreCheveux: { 
                                                ...prev.couvreCheveux, 
                                                type: type as 'foulard' | 'perruque' 
                                              } 
                                            }));
                                          }
                                        }}
                                        className="mr-2"
                                        name="typeCouverture"
                                      />
                                      <span className="text-sm">
                                        {type === 'foulard' ? 'Foulard' : 'Perruque'}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Jupe ou pantalon</label>
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  checked={profile.jupeOuPantalon === 'jupe'}
                                  onChange={() => setProfile(prev => ({ ...prev, jupeOuPantalon: 'jupe' }))}
                                  className="mr-2"
                                />
                                <span className="text-sm">Jupe</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  checked={profile.jupeOuPantalon === 'pantalon'}
                                  onChange={() => setProfile(prev => ({ ...prev, jupeOuPantalon: 'pantalon' }))}
                                  className="mr-2"
                                />
                                <span className="text-sm">Pantalon</span>
                              </label>
                            </div>
                          </div>
                          
                          <div>
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
                              <span className="text-sm">Porte des collants</span>
                            </label>
                          </div>
                          
                          <div>
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
                              <span className="text-sm">Porte des manches courtes</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apparence */}
                  <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-400">
                    <h2 className="text-xl font-bold text-indigo-800 mb-4">👤 Apparence</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Taille (cm)</label>
                        <input
                          type="number"
                          value={profile.taille}
                          onChange={(e) => setProfile(prev => ({ ...prev, taille: parseInt(e.target.value) || 170 }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min="140"
                          max="220"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur des yeux</label>
                        <select
                          value={profile.couleurYeux || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, couleurYeux: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="bleu">Bleu</option>
                          <option value="vert">Vert</option>
                          <option value="marron">Marron</option>
                          <option value="noisette">Noisette</option>
                          <option value="gris">Gris</option>
                          <option value="noir">Noir</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur de peau</label>
                        <select
                          value={profile.couleurPeau}
                          onChange={(e) => setProfile(prev => ({ ...prev, couleurPeau: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="claire">Claire</option>
                          <option value="moyenne">Moyenne</option>
                          <option value="mate">Mate</option>
                          <option value="foncée">Foncée</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Couleur des cheveux</label>
                        <select
                          value={profile.couleurCheveux || ''}
                          onChange={(e) => setProfile(prev => ({ ...prev, couleurCheveux: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="blond">Blond</option>
                          <option value="chatain">Châtain</option>
                          <option value="brun">Brun</option>
                          <option value="noir">Noir</option>
                          <option value="roux">Roux</option>
                          <option value="gris">Gris/Blanc</option>
                        </select>
                      </div>
                      
                      {profile.genre === 'femme' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Longueur des cheveux</label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.cheveuxLongs === false}
                                onChange={() => setProfile(prev => ({ ...prev, cheveuxLongs: false }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Courts</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                checked={profile.cheveuxLongs === true}
                                onChange={() => setProfile(prev => ({ ...prev, cheveuxLongs: true }))}
                                className="mr-2"
                              />
                              <span className="text-sm">Longs</span>
                            </label>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Morphologie</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.gros === false}
                              onChange={() => setProfile(prev => ({ ...prev, gros: false }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Mince/Normal</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.gros === true}
                              onChange={() => setProfile(prev => ({ ...prev, gros: true }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Corpulent</span>
                          </label>
                        </div>
                      </div>
                      
                      {profile.genre === 'homme' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Barbe</label>
                          <select
                            value={profile.typeBarbier || 'rase'}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              typeBarbier: e.target.value as 'rase' | 'taille' | 'barbu',
                              barbe: e.target.value !== 'rase'
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="rase">Rasé</option>
                            <option value="taille">Taillée</option>
                            <option value="barbu">Barbu</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Santé */}
                  <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
                    <h2 className="text-xl font-bold text-green-800 mb-4">🩺 Santé</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fume</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.fume === true}
                              onChange={() => setProfile(prev => ({ ...prev, fume: true }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.fume === false}
                              onChange={() => setProfile(prev => ({ ...prev, fume: false }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Non</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Problèmes de santé actuels</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.problemeSante.actuel === true}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                problemeSante: { ...prev.problemeSante, actuel: true }
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.problemeSante.actuel === false}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                problemeSante: { ...prev.problemeSante, actuel: false }
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Non</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Problèmes de santé passés</label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.problemeSante.passe === true}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                problemeSante: { ...prev.problemeSante, passe: true }
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={profile.problemeSante.passe === false}
                              onChange={() => setProfile(prev => ({ 
                                ...prev, 
                                problemeSante: { ...prev.problemeSante, passe: false }
                              }))}
                              className="mr-2"
                            />
                            <span className="text-sm">Non</span>
                          </label>
                        </div>
                      </div>
                      
                      {(profile.problemeSante.actuel || profile.problemeSante.passe) && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Détails sur les problèmes de santé</label>
                          <textarea
                            value={profile.problemeSante.details || ''}
                            onChange={(e) => setProfile(prev => ({ 
                              ...prev, 
                              problemeSante: { ...prev.problemeSante, details: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            rows={3}
                            placeholder="Précisions sur les problèmes de santé..."
                          />
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