export interface Profile {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Informations de base
  prenom: string;
  nom: string;
  dateNaissance: string;
  paysNaissance?: string;
  villeNaissance: string;
  paysResidence?: string;
  alya: boolean;
  dateAlya?: string;
  genre: 'homme' | 'femme';
  photoProfile?: string;
  partagePhoto: 'unique' | 'multiple' | 'non';
  partageProfil: boolean;
  
  // Origine
  origine: 'sefarade' | 'ashkenaze';
  paysOrigine?: ('tunisie' | 'algerie' | 'maroc')[];
  
  // Parcours et formation
  aBac: boolean;
  ecoles?: string[];
  yeshivaKetana?: string[];
  yeshivaGuedola?: string[];
  seminaire?: string[];
  formationProfessionnelle: string;
  domaineEtudes?: string;
  universite?: string[];
  
  // Travail
  travailActuel: string;
  lieuTravail?: string;
  
  // Hobbies et passions
  hobbies: string[];
  
  // Apparence physique
  taille: number;
  couleurYeux?: string;
  couleurPeau: string;
  couleurCheveux?: string;
  cheveuxLongs?: boolean;
  gros: boolean;
  
  // Spécifique homme
  barbe?: boolean;
  typeBarbier?: 'rase' | 'taille' | 'barbu';
  
  // Midot
  midot: string[];
  
  // Religion
  courantReligieux: 'dati' | 'haredi' | 'habad';
  
  // Religion - Commun
  telephone: {
    possede: boolean;
    type?: 'casher-avec-internet' | 'casher-sans-internet' | 'sans-message' | 'normal';
  };
  films: boolean;
  reseauxSociaux: {
    utilise: boolean;
    lesquels?: string[];
  };
  television: boolean;
  
  // Religion - Homme
  etudeTorahNiveau?: 1 | 2 | 3 | 4 | 5;
  
  // Religion - Femme
  couvreCheveux: {
    oui: boolean;
    type?: 'foulard' | 'perruque' | string[];
  };
  collants?: boolean;
  jupeOuPantalon?: 'jupe' | 'pantalon';
  manchesCourtes?: boolean;
  
  // Famille
  statutParents: 'vivent' | 'decedes' | 'divorce';
  parentsConverti: boolean;
  parentsdivorce: boolean;
  nombreEnfantsParents: number;
  prenomPerefrancais: string;
  prenomPerehebreu: string;
  prenomMerefrancais: string;
  prenomMerehebreu: string;
  nomJeuneFillleMere: string;
  nombreFreresSoeurs: number;
  
  // Santé
  fume: boolean;
  problemeSante: {
    actuel: boolean;
    passe: boolean;
    details?: string;
  };
  
  // Parcours (ancien format - à migrer)
  parcours: {
    ecole?: string;
    yeshivaKetana?: string;
    etudesUniversitaires?: string;
    yeshivaGuedola?: string;
    seminaire?: string;
    formations: string[];
  };
  
  // Si Dati
  armee?: boolean;
  sortIsrael?: boolean;
  
  // Si Haredi
  pourArmee?: boolean;
  noirBlanc?: boolean;
  
  // Critères
  criteres: {
    ageMin: number;
    ageMax: number;
    origine: 'sefarade' | 'ashkenaze' | 'indifferent';
    courantReligieux: string[];
    autresCriteres: string[];
  };
  
  // Historique et notes
  historique: any[];
  notes: Record<string, string>;
}

export interface HistoriqueEntry {
  id: string;
  type: 'trait-caractere' | 'rencontre';
  date: string;
  contenu: string;
  personneRencontree?: string;
  nombreRencontre?: number;
  lieu?: string;
  heure?: string;
  commentaire?: string;
}

export interface RendezVous {
  id: string;
  date: string;
  heure: string;
  lieu: string;
  type: 'premier-rdv' | 'rencontre';
  
  // Pour un premier RDV
  nouveauCandidat?: {
    prenom: string;
    nom: string;
    telephone?: string;
    email?: string;
    notes?: string;
  };
  
  // Pour une rencontre entre candidats
  personne1Id: string;
  personne2Id: string;
  numeroRencontre: number;
  
  commentaire?: string;
  statut: 'prevu' | 'realise' | 'annule';
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  type: 'premier-rdv' | 'rencontre';
  message: string;
  date: string;
  heure: string;
  lieu: string;
  emoji: string;
}

export interface SearchCriteria {
  ageMin?: number;
  ageMax?: number;
  genre?: 'homme' | 'femme';
  origine?: 'sefarade' | 'ashkenaze' | 'indifferent';
  courantReligieux?: string[];
  ville?: string;
  alya?: boolean;
  taille?: { min: number; max: number };
  barbe?: boolean;
  fume?: boolean;
  armee?: boolean;
  telephone?: string;
  films?: boolean;
  reseauxSociaux?: boolean;
}