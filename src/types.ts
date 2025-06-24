export interface Profile {
  id: string;
  // Informations de base
  prenom: string;
  nom: string;
  dateNaissance: string;
  villeNaissance: string;
  alya: boolean;
  dateAlya?: string;
  genre: 'homme' | 'femme';
  
  // Formation et travail
  formationProfessionnelle: string;
  etudes: string;
  travailActuel: string;
  
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
  origine: 'sefarade' | 'ashkenaze';
  paysOrigine?: ('tunisie' | 'algerie' | 'maroc')[];
  
  // Physique
  taille: number;
  barbe?: boolean;
  couleurPeau: string;
  gros: boolean;
  
  // Photo
  photoProfile?: string;
  partagePhoto: 'unique' | 'multiple' | 'non';
  partageProfil: boolean;
  
  // Nouveaux champs
  hobbies: string[];
  
  // About yourself
  parcours: {
    ecole?: string;
    yeshivaKetana?: string;
    etudesUniversitaires?: string;
    yeshivaGuedola?: string;
    seminaire?: string;
    formations: string[];
  };
  
  // Midot
  midot: string[];
  
  // Religion
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
    type?: 'foulard' | 'perruque';
  };
  collants?: boolean;
  manchesCourtes?: boolean;
  
  // Santé
  fume: boolean;
  problemeSante: {
    actuel: boolean;
    passe: boolean;
    details?: string;
  };
  
  // Courant religieux
  courantReligieux: 'dati' | 'haredi' | 'habad';
  
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
  
  // Historique et rencontres
  historique: HistoriqueEntry[];
  
  // Notes par catégorie
  notes: {
    general?: string;
    famille?: string;
    religion?: string;
    physique?: string;
    sante?: string;
    parcours?: string;
  };
  
  createdAt: string;
  updatedAt: string;
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