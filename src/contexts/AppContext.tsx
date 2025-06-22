import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Profile, RendezVous, SearchCriteria } from '../types';

interface AppState {
  profiles: Profile[];
  rendezVous: RendezVous[];
  selectedProfile: Profile | null;
  designMode: 'form' | 'bubbles';
  selectedDate: string | null;
  searchCriteria: SearchCriteria;
}

type AppAction =
  | { type: 'SET_PROFILES'; payload: Profile[] }
  | { type: 'ADD_PROFILE'; payload: Profile }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SET_SELECTED_PROFILE'; payload: Profile | null }
  | { type: 'SET_DESIGN_MODE'; payload: 'form' | 'bubbles' }
  | { type: 'ADD_RENDEZ_VOUS'; payload: RendezVous }
  | { type: 'UPDATE_RENDEZ_VOUS'; payload: RendezVous }
  | { type: 'DELETE_RENDEZ_VOUS'; payload: string }
  | { type: 'SET_RENDEZ_VOUS'; payload: RendezVous[] }
  | { type: 'SET_SELECTED_DATE'; payload: string | null }
  | { type: 'SET_SEARCH_CRITERIA'; payload: SearchCriteria };

const initialState: AppState = {
  profiles: [],
  rendezVous: [],
  selectedProfile: null,
  designMode: 'form',
  selectedDate: null,
  searchCriteria: {}
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROFILES':
      return { ...state, profiles: action.payload };
    case 'ADD_PROFILE':
      return { ...state, profiles: [...state.profiles, action.payload] };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.filter(p => p.id !== action.payload)
      };
    case 'SET_SELECTED_PROFILE':
      return { ...state, selectedProfile: action.payload };
    case 'SET_DESIGN_MODE':
      return { ...state, designMode: action.payload };
    case 'ADD_RENDEZ_VOUS':
      return { ...state, rendezVous: [...state.rendezVous, action.payload] };
    case 'UPDATE_RENDEZ_VOUS':
      return {
        ...state,
        rendezVous: state.rendezVous.map(r => r.id === action.payload.id ? action.payload : r)
      };
    case 'DELETE_RENDEZ_VOUS':
      return {
        ...state,
        rendezVous: state.rendezVous.filter(r => r.id !== action.payload)
      };
    case 'SET_RENDEZ_VOUS':
      return { ...state, rendezVous: action.payload };
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_SEARCH_CRITERIA':
      return { ...state, searchCriteria: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence avec localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('shidduch-profiles');
    const savedRendezVous = localStorage.getItem('shidduch-rendez-vous');
    const savedDesignMode = localStorage.getItem('shidduch-design-mode');
    
    if (savedProfiles) {
      dispatch({ type: 'SET_PROFILES', payload: JSON.parse(savedProfiles) });
    }
    if (savedRendezVous) {
      dispatch({ type: 'SET_RENDEZ_VOUS', payload: JSON.parse(savedRendezVous) });
    }
    if (savedDesignMode) {
      dispatch({ type: 'SET_DESIGN_MODE', payload: savedDesignMode as 'form' | 'bubbles' });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shidduch-profiles', JSON.stringify(state.profiles));
  }, [state.profiles]);

  useEffect(() => {
    localStorage.setItem('shidduch-rendez-vous', JSON.stringify(state.rendezVous));
  }, [state.rendezVous]);

  useEffect(() => {
    localStorage.setItem('shidduch-design-mode', state.designMode);
  }, [state.designMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}