import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { RendezVous } from '../types';
import { Save, X, Calendar, Clock, MapPin, Users } from 'lucide-react';

interface RendezVousFormProps {
  selectedDate?: string;
  editingRendezVous?: RendezVous | null;
  onClose: () => void;
}

export default function RendezVousForm({ selectedDate, editingRendezVous, onClose }: RendezVousFormProps) {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    heure: '19:00',
    lieu: '',
    type: 'premier-rdv' as 'premier-rdv' | 'rencontre',
    personne1Id: '',
    personne2Id: '',
    numeroRencontre: 1,
    commentaire: '',
    statut: 'prevu' as 'prevu' | 'realise' | 'annule'
  });

  useEffect(() => {
    if (editingRendezVous) {
      setFormData({
        date: editingRendezVous.date,
        heure: editingRendezVous.heure,
        lieu: editingRendezVous.lieu,
        type: editingRendezVous.type,
        personne1Id: editingRendezVous.personne1Id,
        personne2Id: editingRendezVous.personne2Id,
        numeroRencontre: editingRendezVous.numeroRencontre,
        commentaire: editingRendezVous.commentaire || '',
        statut: editingRendezVous.statut
      });
    }
  }, [editingRendezVous]);

  const getPersonName = (personId: string) => {
    const person = state.profiles.find(p => p.id === personId);
    return person ? `${person.prenom} ${person.nom}` : '';
  };

  const calculateNumeroRencontre = (personne1Id: string, personne2Id: string) => {
    if (!personne1Id || !personne2Id) return 1;
    
    const existingMeetings = state.rendezVous.filter(rdv => 
      (rdv.personne1Id === personne1Id && rdv.personne2Id === personne2Id) ||
      (rdv.personne1Id === personne2Id && rdv.personne2Id === personne1Id)
    );
    
    return existingMeetings.length + 1;
  };

  useEffect(() => {
    if (formData.personne1Id && formData.personne2Id && !editingRendezVous) {
      const numero = calculateNumeroRencontre(formData.personne1Id, formData.personne2Id);
      setFormData(prev => ({
        ...prev,
        numeroRencontre: numero,
        type: numero === 1 ? 'premier-rdv' : 'rencontre'
      }));
    }
  }, [formData.personne1Id, formData.personne2Id, editingRendezVous]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personne1Id || !formData.personne2Id || !formData.lieu) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const rendezVous: RendezVous = {
      id: editingRendezVous?.id || Date.now().toString(),
      ...formData,
      createdAt: editingRendezVous?.createdAt || new Date().toISOString()
    };

    if (editingRendezVous) {
      dispatch({ type: 'UPDATE_RENDEZ_VOUS', payload: rendezVous });
    } else {
      dispatch({ type: 'ADD_RENDEZ_VOUS', payload: rendezVous });
      
      // Ajouter automatiquement à l'historique des deux profils
      const updateProfileHistory = (profileId: string, otherPersonId: string) => {
        const profile = state.profiles.find(p => p.id === profileId);
        if (profile) {
          const otherPerson = state.profiles.find(p => p.id === otherPersonId);
          const historyEntry = {
            id: Date.now().toString() + Math.random(),
            type: 'rencontre' as const,
            date: formData.date,
            contenu: `Rencontre avec ${otherPerson?.prenom} ${otherPerson?.nom}`,
            personneRencontree: otherPersonId,
            nombreRencontre: formData.numeroRencontre,
            lieu: formData.lieu,
            heure: formData.heure,
            commentaire: formData.commentaire
          };
          
          const updatedProfile = {
            ...profile,
            historique: [...profile.historique, historyEntry],
            updatedAt: new Date().toISOString()
          };
          
          dispatch({ type: 'UPDATE_PROFILE', payload: updatedProfile });
        }
      };
      
      updateProfileHistory(formData.personne1Id, formData.personne2Id);
      updateProfileHistory(formData.personne2Id, formData.personne1Id);
    }
    
    onClose();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {editingRendezVous ? '✏️ Modifier le Rendez-vous' : '➕ Nouveau Rendez-vous'}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Participants */}
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <Users className="mr-2" size={24} />
                👥 Participants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personne 1 *</label>
                  <select
                    value={formData.personne1Id}
                    onChange={(e) => setFormData(prev => ({ ...prev, personne1Id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner une personne</option>
                    {state.profiles.map(profile => (
                      <option key={profile.id} value={profile.id}>
                        {profile.prenom} {profile.nom} ({profile.genre === 'homme' ? '👨' : '👩'})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personne 2 *</label>
                  <select
                    value={formData.personne2Id}
                    onChange={(e) => setFormData(prev => ({ ...prev, personne2Id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner une personne</option>
                    {state.profiles
                      .filter(profile => profile.id !== formData.personne1Id)
                      .map(profile => (
                        <option key={profile.id} value={profile.id}>
                          {profile.prenom} {profile.nom} ({profile.genre === 'homme' ? '👨' : '👩'})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              
              {formData.personne1Id && formData.personne2Id && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type de rencontre:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.type === 'premier-rdv' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {formData.type === 'premier-rdv' ? '💙 Premier RDV' : `💚 Rencontre #${formData.numeroRencontre}`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Date et heure */}
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Calendar className="mr-2" size={24} />
                📅 Date et Heure
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
                  <input
                    type="time"
                    value={formData.heure}
                    onChange={(e) => setFormData(prev => ({ ...prev, heure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Lieu */}
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400">
              <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <MapPin className="mr-2" size={24} />
                📍 Lieu
              </h2>
              <input
                type="text"
                value={formData.lieu}
                onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Lieu du rendez-vous"
                required
              />
            </div>

            {/* Statut */}
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
              <h2 className="text-xl font-bold text-yellow-800 mb-4">📊 Statut</h2>
              <select
                value={formData.statut}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="prevu">⏳ Prévu</option>
                <option value="realise">✅ Réalisé</option>
                <option value="annule">❌ Annulé</option>
              </select>
            </div>

            {/* Commentaires */}
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💬 Commentaires</h2>
              <textarea
                value={formData.commentaire}
                onChange={(e) => setFormData(prev => ({ ...prev, commentaire: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                rows={4}
                placeholder="Notes sur ce rendez-vous..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              
              <button
                type="submit"
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save size={20} className="mr-2" />
                {editingRendezVous ? 'Mettre à jour' : 'Créer le RDV'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}