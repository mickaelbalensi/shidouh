import React from 'react';
import { Profile } from '../types';
import { X, Calendar, MapPin, Heart, Phone, Mail, Globe, Book, Users, Home, Briefcase, Star, Activity } from 'lucide-react';

interface ProfileViewProps {
  profile: Profile;
  onClose: () => void;
}

export default function ProfileView({ profile, onClose }: ProfileViewProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {profile.prenom} {profile.nom}
              </h1>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">{calculateAge(profile.dateNaissance)} ans</span>
                <span className="mx-2">•</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profile.genre === 'homme' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-pink-100 text-pink-700'
                }`}>
                  {profile.genre === 'homme' ? '👨' : '👩'} {profile.genre}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations de base */}
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
              <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                👤 Informations de base
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <span>Ville de naissance: {profile.villeNaissance}</span>
                </div>
                <div className="flex items-center">
                  <Globe size={16} className="mr-2 text-gray-500" />
                  <span>Alyah: {profile.alya ? `Oui (${profile.dateAlya})` : 'Non'}</span>
                </div>
                <div className="flex items-center">
                  <Star size={16} className="mr-2 text-gray-500" />
                  <span>Origine: {profile.origine}</span>
                </div>
                {profile.paysOrigine && profile.paysOrigine.length > 0 && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    <span>Pays d'origine: {profile.paysOrigine.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Formation et travail */}
            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
              <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Briefcase className="mr-2" size={20} />
                💼 Formation et travail
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Formation professionnelle:</label>
                  <p>{profile.formationProfessionnelle || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Études:</label>
                  <p>{profile.etudes || 'Non spécifié'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Travail actuel:</label>
                  <p>{profile.travailActuel || 'Non spécifié'}</p>
                </div>
              </div>
            </div>

            {/* Famille */}
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-400">
              <h2 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                <Home className="mr-2" size={20} />
                👨‍👩‍👧‍👦 Famille
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Parents:</label>
                  <p>
                    {profile.statutParents === 'vivent' ? 'Vivent ensemble' : 
                     profile.statutParents === 'decedes' ? 'Décédés' : 'Divorcés'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Père:</label>
                  <p>{profile.prenomPerefrancais} ({profile.prenomPerehebreu})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mère:</label>
                  <p>{profile.prenomMerefrancais} ({profile.prenomMerehebreu})</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Nom de jeune fille de la mère:</label>
                  <p>{profile.nomJeuneFillleMere}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Frères et sœurs:</label>
                  <p>{profile.nombreFreresSoeurs}</p>
                </div>
                {profile.parentsConverti && (
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      Parents convertis
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Religion */}
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
              <h2 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <Book className="mr-2" size={20} />
                🕯️ Religion
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Courant religieux:</label>
                  <p className="capitalize">{profile.courantReligieux}</p>
                </div>

                {/* Spécifique au genre */}
                {profile.genre === 'homme' ? (
                  <>
                    {profile.etudeTorahNiveau && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Niveau d'étude de la Torah:</label>
                        <p>Niveau {profile.etudeTorahNiveau}</p>
                      </div>
                    )}
                    {profile.barbe !== undefined && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Barbe:</label>
                        <p>{profile.barbe ? 'Oui' : 'Non'}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Couvre les cheveux:</label>
                      <p>
                        {profile.couvreCheveux.oui ? `Oui (${profile.couvreCheveux.type})` : 'Non'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tenue vestimentaire:</label>
                      <div className="space-y-1">
                        <p>Collants: {profile.collants ? 'Oui' : 'Non'}</p>
                        <p>Manches courtes: {profile.manchesCourtes ? 'Oui' : 'Non'}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Pratiques communes */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Utilisation des médias:</label>
                  <div className="space-y-1">
                    <p>Téléphone: {profile.telephone.possede ? `Oui (${profile.telephone.type})` : 'Non'}</p>
                    <p>Films: {profile.films ? 'Oui' : 'Non'}</p>
                    <p>Télévision: {profile.television ? 'Oui' : 'Non'}</p>
                    <p>Réseaux sociaux: {profile.reseauxSociaux.utilise ? `Oui (${profile.reseauxSociaux.lesquels?.join(', ')})` : 'Non'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Physique */}
            <div className="bg-pink-50 p-6 rounded-xl border-l-4 border-pink-400">
              <h2 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
                <Activity className="mr-2" size={20} />
                👁️ Physique
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Taille:</label>
                  <p>{profile.taille} cm</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Couleur de peau:</label>
                  <p>{profile.couleurPeau}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Corpulence:</label>
                  <p>{profile.gros ? 'Fort(e)' : 'Normal(e)'}</p>
                </div>
              </div>
            </div>

            {/* Critères */}
            <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-400">
              <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                <Heart className="mr-2" size={20} />
                💝 Critères recherchés
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Âge:</label>
                  <p>Entre {profile.criteres.ageMin} et {profile.criteres.ageMax} ans</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Origine souhaitée:</label>
                  <p className="capitalize">{profile.criteres.origine}</p>
                </div>
                {profile.criteres.courantReligieux.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Courants religieux acceptés:</label>
                    <p>{profile.criteres.courantReligieux.join(', ')}</p>
                  </div>
                )}
                {profile.criteres.autresCriteres.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Autres critères:</label>
                    <ul className="list-disc list-inside">
                      {profile.criteres.autresCriteres.map((critere, index) => (
                        <li key={index}>{critere}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-400">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📞 Contact</h2>
              <div className="space-y-3">
                {profile.telephone.possede && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span>Téléphone: {profile.telephone.type}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <span>Partage de photo: {profile.partagePhoto}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <span>Dernière mise à jour: {new Date(profile.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {Object.values(profile.notes).some(note => note) && (
              <div className="col-span-2 bg-orange-50 p-6 rounded-xl border-l-4 border-orange-400">
                <h2 className="text-xl font-bold text-orange-800 mb-4">📝 Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.notes.general && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Général:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.general}</p>
                    </div>
                  )}
                  {profile.notes.famille && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Famille:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.famille}</p>
                    </div>
                  )}
                  {profile.notes.religion && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Religion:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.religion}</p>
                    </div>
                  )}
                  {profile.notes.physique && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Physique:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.physique}</p>
                    </div>
                  )}
                  {profile.notes.sante && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Santé:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.sante}</p>
                    </div>
                  )}
                  {profile.notes.parcours && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Parcours:</label>
                      <p className="whitespace-pre-wrap">{profile.notes.parcours}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 