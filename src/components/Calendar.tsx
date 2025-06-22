import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';
import RendezVousForm from './RendezVousForm';

export default function Calendar() {
  const { state, dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingRendezVous, setEditingRendezVous] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const getPersonName = (personId: string) => {
    const person = state.profiles.find(p => p.id === personId);
    return person ? `${person.prenom} ${person.nom}` : 'Profil introuvable';
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Jours du mois précédent
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Jours du mois suivant pour compléter la grille
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getRendezVousForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return state.rendezVous.filter(rdv => rdv.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    dispatch({ type: 'SET_SELECTED_DATE', payload: dateStr });
    setShowForm(true);
  };

  const handleEditRendezVous = (rdv: any) => {
    setEditingRendezVous(rdv);
    setShowForm(true);
  };

  const handleDeleteRendezVous = (rdvId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      dispatch({ type: 'DELETE_RENDEZ_VOUS', payload: rdvId });
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (showForm) {
    return (
      <RendezVousForm
        selectedDate={selectedDate}
        editingRendezVous={editingRendezVous}
        onClose={() => {
          setShowForm(false);
          setEditingRendezVous(null);
          setSelectedDate('');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <CalendarIcon className="text-blue-600 mr-3" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">📅 Agenda des Rencontres</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nouveau RDV
            </button>
          </div>

          {/* Navigation du calendrier */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Précédent
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Suivant →
            </button>
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-50 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const rendezVous = getRendezVousForDate(day.date);
              const isToday = day.date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                  className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                    day.isCurrentMonth
                      ? 'bg-white hover:bg-blue-50 border-gray-200'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  } ${isToday ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-600 font-bold' : 'text-gray-700'
                  }`}>
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {rendezVous.map(rdv => (
                      <div
                        key={rdv.id}
                        className={`text-xs p-1 rounded text-white cursor-pointer group relative ${
                          rdv.type === 'premier-rdv' 
                            ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRendezVous(rdv);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">
                            {rdv.type === 'premier-rdv' ? '💙' : '💚'} {rdv.heure}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditRendezVous(rdv);
                              }}
                              className="text-white hover:text-yellow-200"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRendezVous(rdv.id);
                              }}
                              className="text-white hover:text-red-200"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="truncate text-xs opacity-90">
                          {getPersonName(rdv.personne1Id)} & {getPersonName(rdv.personne2Id)}
                        </div>
                        {rdv.type === 'rencontre' && (
                          <div className="text-xs opacity-75">
                            Rencontre #{rdv.numeroRencontre}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-8 flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">💙 Premier rendez-vous</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span className="text-sm text-gray-600">💚 Rencontres suivantes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}