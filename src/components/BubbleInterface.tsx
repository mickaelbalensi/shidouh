import React, { useState } from 'react';
import { Profile } from '../types';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';

interface BubbleInterfaceProps {
  profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>;
  setProfile: React.Dispatch<React.SetStateAction<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>>;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingProfile?: Profile | null;
}

interface BubbleProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  color: string;
  disabled?: boolean;
}

function Bubble({ children, selected, onClick, color, disabled }: BubbleProps) {
  const baseClasses = "px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-2 min-w-[120px] text-center";
  const colorClasses = {
    blue: selected 
      ? "bg-blue-500 text-white border-blue-500 shadow-lg scale-105" 
      : "bg-white text-blue-600 border-blue-300 hover:border-blue-400 hover:bg-blue-50",
    pink: selected 
      ? "bg-pink-500 text-white border-pink-500 shadow-lg scale-105" 
      : "bg-white text-pink-600 border-pink-300 hover:border-pink-400 hover:bg-pink-50",
    green: selected 
      ? "bg-green-500 text-white border-green-500 shadow-lg scale-105" 
      : "bg-white text-green-600 border-green-300 hover:border-green-400 hover:bg-green-50",
    purple: selected 
      ? "bg-purple-500 text-white border-purple-500 shadow-lg scale-105" 
      : "bg-white text-purple-600 border-purple-300 hover:border-purple-400 hover:bg-purple-50",
    yellow: selected 
      ? "bg-yellow-500 text-white border-yellow-500 shadow-lg scale-105" 
      : "bg-white text-yellow-600 border-yellow-300 hover:border-yellow-400 hover:bg-yellow-50",
    red: selected 
      ? "bg-red-500 text-white border-red-500 shadow-lg scale-105" 
      : "bg-white text-red-600 border-red-300 hover:border-red-400 hover:bg-red-50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses[color as keyof typeof colorClasses]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

export default function BubbleInterface({ profile, setProfile, onSave, onCancel, editingProfile }: BubbleInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState<string | null>(null);

  const steps = [
    {
      id: 'basic',
      title: '👤 Informations de Base',
      color: 'blue'
    },
    {
      id: 'religion',
      title: '🕯️ Courant Religieux',
      color: 'purple'
    },
    {
      id: 'physical',
      title: '👁️ Apparence Physique',
      color: 'green'
    },
    {
      id: 'family',
      title: '👨‍👩‍👧‍👦 Famille',
      color: 'pink'
    },
    {
      id: 'lifestyle',
      title: '📱 Mode de Vie',
      color: 'yellow'
    },
    {
      id: 'health',
      title: '🏥 Santé',
      color: 'red'
    }
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic info
        return profile.prenom && profile.nom && profile.dateNaissance && profile.genre;
      case 1: // Religion
        return profile.courantReligieux;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
      setSubStep(null);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSubStep(null);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-8">
      {/* Genre */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vous êtes :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.genre === 'homme'}
            onClick={() => setProfile(prev => ({ ...prev, genre: 'homme' }))}
            color="blue"
          >
            👨 Homme
          </Bubble>
          <Bubble
            selected={profile.genre === 'femme'}
            onClick={() => setProfile(prev => ({ ...prev, genre: 'femme' }))}
            color="pink"
          >
            👩 Femme
          </Bubble>
        </div>
      </div>

      {/* Informations textuelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Prénom *</label>
          <input
            type="text"
            value={profile.prenom}
            onChange={(e) => setProfile(prev => ({ ...prev, prenom: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Votre prénom"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Nom *</label>
          <input
            type="text"
            value={profile.nom}
            onChange={(e) => setProfile(prev => ({ ...prev, nom: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Votre nom"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Date de naissance *</label>
          <input
            type="date"
            value={profile.dateNaissance}
            onChange={(e) => setProfile(prev => ({ ...prev, dateNaissance: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Ville de naissance</label>
          <input
            type="text"
            value={profile.villeNaissance}
            onChange={(e) => setProfile(prev => ({ ...prev, villeNaissance: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Votre ville de naissance"
          />
        </div>
      </div>

      {/* Alya */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Avez-vous fait votre Alya ?</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.alya === true}
            onClick={() => setProfile(prev => ({ ...prev, alya: true }))}
            color="blue"
          >
            🇮🇱 Oui
          </Bubble>
          <Bubble
            selected={profile.alya === false}
            onClick={() => setProfile(prev => ({ ...prev, alya: false }))}
            color="blue"
          >
            🏠 Non
          </Bubble>
        </div>
        
        {profile.alya && (
          <div className="mt-4 max-w-xs mx-auto">
            <label className="block text-sm font-medium mb-2">Date d'Alya</label>
            <input
              type="date"
              value={profile.dateAlya || ''}
              onChange={(e) => setProfile(prev => ({ ...prev, dateAlya: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderReligion = () => (
    <div className="space-y-8">
      {!subStep && (
        <>
          <h3 className="text-lg font-semibold mb-4">Quel est votre courant religieux ?</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            <Bubble
              selected={profile.courantReligieux === 'dati'}
              onClick={() => {
                setProfile(prev => ({ ...prev, courantReligieux: 'dati' }));
                setSubStep('dati');
              }}
              color="purple"
            >
              📚 Dati
            </Bubble>
            <Bubble
              selected={profile.courantReligieux === 'haredi'}
              onClick={() => {
                setProfile(prev => ({ ...prev, courantReligieux: 'haredi' }));
                setSubStep('haredi');
              }}
              color="purple"
            >
              🎩 Haredi
            </Bubble>
            <Bubble
              selected={profile.courantReligieux === 'habad'}
              onClick={() => {
                setProfile(prev => ({ ...prev, courantReligieux: 'habad' }));
                setSubStep('habad');
              }}
              color="purple"
            >
              👑 Habad
            </Bubble>
          </div>
        </>
      )}

      {subStep === 'dati' && (
        <div className="space-y-6">
          <button
            onClick={() => setSubStep(null)}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour
          </button>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Armée :</h3>
            <div className="flex gap-4 justify-center">
              <Bubble
                selected={profile.armee === true}
                onClick={() => setProfile(prev => ({ ...prev, armee: true }))}
                color="green"
              >
                🪖 Oui
              </Bubble>
              <Bubble
                selected={profile.armee === false}
                onClick={() => setProfile(prev => ({ ...prev, armee: false }))}
                color="red"
              >
                🚫 Non
              </Bubble>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Sort d'Israël :</h3>
            <div className="flex gap-4 justify-center">
              <Bubble
                selected={profile.sortIsrael === true}
                onClick={() => setProfile(prev => ({ ...prev, sortIsrael: true }))}
                color="blue"
              >
                ✈️ Oui
              </Bubble>
              <Bubble
                selected={profile.sortIsrael === false}
                onClick={() => setProfile(prev => ({ ...prev, sortIsrael: false }))}
                color="blue"
              >
                🏠 Non
              </Bubble>
            </div>
          </div>
        </div>
      )}

      {subStep === 'haredi' && (
        <div className="space-y-6">
          <button
            onClick={() => setSubStep(null)}
            className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour
          </button>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Position sur l'armée :</h3>
            <div className="flex gap-4 justify-center">
              <Bubble
                selected={profile.pourArmee === true}
                onClick={() => setProfile(prev => ({ ...prev, pourArmee: true }))}
                color="green"
              >
                ✅ Pour
              </Bubble>
              <Bubble
                selected={profile.pourArmee === false}
                onClick={() => setProfile(prev => ({ ...prev, pourArmee: false }))}
                color="red"
              >
                ❌ Contre
              </Bubble>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Style vestimentaire :</h3>
            <div className="flex gap-4 justify-center">
              <Bubble
                selected={profile.noirBlanc === true}
                onClick={() => setProfile(prev => ({ ...prev, noirBlanc: true }))}
                color="purple"
              >
                ⚫⚪ Noir et Blanc
              </Bubble>
              <Bubble
                selected={profile.noirBlanc === false}
                onClick={() => setProfile(prev => ({ ...prev, noirBlanc: false }))}
                color="purple"
              >
                🌈 Autre
              </Bubble>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPhysical = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Taille (cm)</h3>
        <div className="max-w-xs mx-auto">
          <input
            type="number"
            value={profile.taille}
            onChange={(e) => setProfile(prev => ({ ...prev, taille: parseInt(e.target.value) || 170 }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none text-center text-lg"
            min="140"
            max="220"
          />
        </div>
      </div>

      {profile.genre === 'homme' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Barbe :</h3>
          <div className="flex gap-4 justify-center">
            <Bubble
              selected={profile.barbe === true}
              onClick={() => setProfile(prev => ({ ...prev, barbe: true }))}
              color="green"
            >
              🧔 Avec barbe
            </Bubble>
            <Bubble
              selected={profile.barbe === false}
              onClick={() => setProfile(prev => ({ ...prev, barbe: false }))}
              color="green"
            >
              😊 Sans barbe
            </Bubble>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">Morphologie :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.gros === false}
            onClick={() => setProfile(prev => ({ ...prev, gros: false }))}
            color="green"
          >
            👤 Mince/Normal
          </Bubble>
          <Bubble
            selected={profile.gros === true}
            onClick={() => setProfile(prev => ({ ...prev, gros: true }))}
            color="green"
          >
            👥 Corpulent
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Origine :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.origine === 'sefarade'}
            onClick={() => setProfile(prev => ({ ...prev, origine: 'sefarade' }))}
            color="green"
          >
            🌍 Séfarade
          </Bubble>
          <Bubble
            selected={profile.origine === 'ashkenaze'}
            onClick={() => setProfile(prev => ({ ...prev, origine: 'ashkenaze' }))}
            color="green"
          >
            🌎 Ashkénaze
          </Bubble>
        </div>
      </div>

      {profile.origine === 'sefarade' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Pays d'origine :</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            {['tunisie', 'algerie', 'maroc'].map(pays => (
              <Bubble
                key={pays}
                selected={profile.paysOrigine?.includes(pays as any) || false}
                onClick={() => {
                  const current = profile.paysOrigine || [];
                  const updated = current.includes(pays as any)
                    ? current.filter(p => p !== pays)
                    : [...current, pays as any];
                  setProfile(prev => ({ ...prev, paysOrigine: updated }));
                }}
                color="green"
              >
                {pays === 'tunisie' && '🇹🇳 Tunisie'}
                {pays === 'algerie' && '🇩🇿 Algérie'}
                {pays === 'maroc' && '🇲🇦 Maroc'}
              </Bubble>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderFamily = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Statut des parents :</h3>
        <div className="flex gap-4 justify-center flex-wrap">
          <Bubble
            selected={profile.statutParents === 'vivent'}
            onClick={() => setProfile(prev => ({ ...prev, statutParents: 'vivent' }))}
            color="pink"
          >
            ❤️ Vivent
          </Bubble>
          <Bubble
            selected={profile.statutParents === 'decedes'}
            onClick={() => setProfile(prev => ({ ...prev, statutParents: 'decedes' }))}
            color="pink"
          >
            🕯️ Décédés
          </Bubble>
          <Bubble
            selected={profile.statutParents === 'divorce'}
            onClick={() => setProfile(prev => ({ ...prev, statutParents: 'divorce' }))}
            color="pink"
          >
            💔 Divorcés
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Parents convertis :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.parentsConverti === true}
            onClick={() => setProfile(prev => ({ ...prev, parentsConverti: true }))}
            color="pink"
          >
            ✡️ Oui
          </Bubble>
          <Bubble
            selected={profile.parentsConverti === false}
            onClick={() => setProfile(prev => ({ ...prev, parentsConverti: false }))}
            color="pink"
          >
            👨‍👩‍👧‍👦 Non
          </Bubble>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nombre de frères et sœurs</label>
          <input
            type="number"
            value={profile.nombreFreresSoeurs}
            onChange={(e) => setProfile(prev => ({ ...prev, nombreFreresSoeurs: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none text-center"
            min="0"
            max="20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Prénom du père (français)</label>
          <input
            type="text"
            value={profile.prenomPerefrancais}
            onChange={(e) => setProfile(prev => ({ ...prev, prenomPerefrancais: e.target.value }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  const renderLifestyle = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Possède un téléphone :</h3>
        <div className="flex gap-4 justify-center flex-wrap">
          <Bubble
            selected={profile.telephone.possede === false}
            onClick={() => setProfile(prev => ({ ...prev, telephone: { possede: false } }))}
            color="yellow"
          >
            🚫 Non
          </Bubble>
          <Bubble
            selected={profile.telephone.possede === true && profile.telephone.type === 'casher-sans-internet'}
            onClick={() => setProfile(prev => ({ ...prev, telephone: { possede: true, type: 'casher-sans-internet' } }))}
            color="yellow"
          >
            📞 Casher sans internet
          </Bubble>
          <Bubble
            selected={profile.telephone.possede === true && profile.telephone.type === 'casher-avec-internet'}
            onClick={() => setProfile(prev => ({ ...prev, telephone: { possede: true, type: 'casher-avec-internet' } }))}
            color="yellow"
          >
            📱 Casher avec internet
          </Bubble>
          <Bubble
            selected={profile.telephone.possede === true && profile.telephone.type === 'normal'}
            onClick={() => setProfile(prev => ({ ...prev, telephone: { possede: true, type: 'normal' } }))}
            color="yellow"
          >
            📲 Normal
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Regarde des films :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.films === true}
            onClick={() => setProfile(prev => ({ ...prev, films: true }))}
            color="yellow"
          >
            🎬 Oui
          </Bubble>
          <Bubble
            selected={profile.films === false}
            onClick={() => setProfile(prev => ({ ...prev, films: false }))}
            color="yellow"
          >
            🚫 Non
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Utilise les réseaux sociaux :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.reseauxSociaux.utilise === true}
            onClick={() => setProfile(prev => ({ ...prev, reseauxSociaux: { utilise: true, lesquels: [] } }))}
            color="yellow"
          >
            📱 Oui
          </Bubble>
          <Bubble
            selected={profile.reseauxSociaux.utilise === false}
            onClick={() => setProfile(prev => ({ ...prev, reseauxSociaux: { utilise: false } }))}
            color="yellow"
          >
            🚫 Non
          </Bubble>
        </div>
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Fume :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.fume === false}
            onClick={() => setProfile(prev => ({ ...prev, fume: false }))}
            color="green"
          >
            🚫 Non-fumeur
          </Bubble>
          <Bubble
            selected={profile.fume === true}
            onClick={() => setProfile(prev => ({ ...prev, fume: true }))}
            color="red"
          >
            🚬 Fumeur
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Problèmes de santé actuels :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.problemeSante.actuel === false}
            onClick={() => setProfile(prev => ({ ...prev, problemeSante: { ...prev.problemeSante, actuel: false } }))}
            color="green"
          >
            ✅ Aucun
          </Bubble>
          <Bubble
            selected={profile.problemeSante.actuel === true}
            onClick={() => setProfile(prev => ({ ...prev, problemeSante: { ...prev.problemeSante, actuel: true } }))}
            color="red"
          >
            ⚠️ Oui
          </Bubble>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Problèmes de santé passés :</h3>
        <div className="flex gap-4 justify-center">
          <Bubble
            selected={profile.problemeSante.passe === false}
            onClick={() => setProfile(prev => ({ ...prev, problemeSante: { ...prev.problemeSante, passe: false } }))}
            color="green"
          >
            ✅ Aucun
          </Bubble>
          <Bubble
            selected={profile.problemeSante.passe === true}
            onClick={() => setProfile(prev => ({ ...prev, problemeSante: { ...prev.problemeSante, passe: true } }))}
            color="yellow"
          >
            ⚠️ Oui
          </Bubble>
        </div>
      </div>

      {(profile.problemeSante.actuel || profile.problemeSante.passe) && (
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium mb-2">Détails (optionnel)</label>
          <textarea
            value={profile.problemeSante.details || ''}
            onChange={(e) => setProfile(prev => ({ 
              ...prev, 
              problemeSante: { ...prev.problemeSante, details: e.target.value } 
            }))}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none"
            rows={3}
            placeholder="Précisions sur les problèmes de santé..."
          />
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderReligion();
      case 2: return renderPhysical();
      case 3: return renderFamily();
      case 4: return renderLifestyle();
      case 5: return renderHealth();
      default: return renderBasicInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {editingProfile ? '✏️ Modifier le Profil' : '➕ Nouveau Profil'}
            </h1>
            
            {/* Progress bar */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? `bg-${step.color}-500 scale-125`
                        : index < currentStep
                        ? `bg-${step.color}-300`
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700">
              {steps[currentStep].title}
            </h2>
          </div>

          {/* Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Précédent
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Étape {currentStep + 1} sur {steps.length}
              </span>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSave}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  {editingProfile ? 'Mettre à jour' : 'Créer le profil'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}