import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { state } = useApp();
  
  // Calculer les notifications du jour
  const today = new Date().toISOString().split('T')[0];
  const todayRendezVous = state.rendezVous.filter(rdv => rdv.date === today && rdv.statut === 'prevu');
  
  const getPersonName = (personId: string) => {
    const person = state.profiles.find(p => p.id === personId);
    return person ? `${person.prenom} ${person.nom}` : 'Profil introuvable';
  };

  const getNotificationEmoji = (type: string, numero: number) => {
    if (type === 'premier-rdv') return '💙';
    return numero === 2 ? '💚' : numero === 3 ? '💛' : numero >= 4 ? '❤️' : '💚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Shalom ! 👋 Bienvenue dans votre espace Shidduch
          </h1>
          <p className="text-gray-600">Gérez vos profils et rendez-vous en toute simplicité</p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">👥 Profils Actifs</h3>
            <p className="text-3xl font-bold text-blue-600">{state.profiles.length}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 RDV Cette Semaine</h3>
            <p className="text-3xl font-bold text-green-600">
              {state.rendezVous.filter(rdv => {
                const rdvDate = new Date(rdv.date);
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekStart.getDate() + 6);
                return rdvDate >= weekStart && rdvDate <= weekEnd && rdv.statut === 'prevu';
              }).length}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Matches Potentiels</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.floor(state.profiles.length / 2)}
            </p>
          </div>
        </div>

        {/* Notifications du jour */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Calendar className="text-orange-500 mr-3" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">Rappels du Jour</h2>
          </div>
          
          {todayRendezVous.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">Aucun rendez-vous prévu aujourd'hui</p>
              <p className="text-gray-400">Profitez de cette journée pour mettre à jour vos profils !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayRendezVous.map(rdv => (
                <div key={rdv.id} className={`p-6 rounded-xl border-l-4 ${
                  rdv.type === 'premier-rdv' 
                    ? 'bg-blue-50 border-blue-400' 
                    : 'bg-green-50 border-green-400'
                } transition-all duration-200 hover:shadow-md`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-3">
                          {getNotificationEmoji(rdv.type, rdv.numeroRencontre)}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {rdv.type === 'premier-rdv' 
                            ? 'Premier rendez-vous' 
                            : `Rencontre n°${rdv.numeroRencontre}`
                          }
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Participants:</span>
                          <span>{getPersonName(rdv.personne1Id)} & {getPersonName(rdv.personne2Id)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-blue-500" />
                          <span className="font-bold text-lg">{rdv.heure}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-green-500" />
                          <span>{rdv.lieu}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        rdv.type === 'premier-rdv'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {rdv.type === 'premier-rdv' ? '1er RDV' : `${rdv.numeroRencontre}e fois`}
                      </div>
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