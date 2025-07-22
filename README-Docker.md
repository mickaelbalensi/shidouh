# Guide Docker pour Shidouh

Ce projet utilise Docker pour garantir une compatibilité cross-platform entre Mac, Windows et Linux.

## Prérequis

- [Docker](https://www.docker.com/get-started) installé sur votre système
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus avec Docker Desktop)

## Démarrage rapide



### Développement

Pour le développement avec hot reload :

```bash
# Lancer en mode développement
docker compose -f docker-compose.dev.yml up --build

# Ou en arrière-plan
docker compose -f docker-compose.dev.yml up -d --build
```

L'application sera accessible sur `http://localhost:5173`


### Production

Pour lancer l'application en mode production :

```bash
# Construire et lancer l'application
docker compose up --build

# Ou en arrière-plan
docker compose up -d --build
```

L'application sera accessible sur `http://localhost:3000`

## Commandes utiles

### Gestion des conteneurs

```bash
# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Voir les logs
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f shidouh-app
```

### Build et maintenance

```bash
# Rebuild sans cache
docker compose build --no-cache

# Nettoyer les images inutilisées
docker system prune

# Nettoyer tout (attention !)
docker system prune -a
```

### Mode développement

```bash
# Entrer dans le conteneur de développement
docker compose -f docker-compose.dev.yml exec shidouh-dev sh

# Installer de nouvelles dépendances
docker compose -f docker-compose.dev.yml exec shidouh-dev npm install [package-name]

# Lancer les tests
docker compose -f docker-compose.dev.yml exec shidouh-dev npm test
```

## Structure des fichiers Docker

- `Dockerfile` : Build multi-stage pour la production (optimisé)
- `Dockerfile.dev` : Build pour le développement avec hot reload
- `docker-compose.yml` : Configuration pour la production
- `docker-compose.dev.yml` : Configuration pour le développement
- `nginx.conf` : Configuration Nginx pour servir l'app React
- `.dockerignore` : Fichiers à exclure du contexte Docker

## Avantages de cette configuration

✅ **Cross-platform** : Fonctionne identiquement sur Mac, Windows et Linux  
✅ **Environnement isolé** : Pas de conflits avec d'autres projets  
✅ **Build optimisé** : Image de production légère avec Nginx  
✅ **Développement simplifié** : Hot reload avec volumes montés  
✅ **Sécurisé** : Headers de sécurité configurés dans Nginx  
✅ **Performance** : Compression gzip et cache des assets statiques  

## Dépannage

### Port déjà utilisé
Si les ports 3000 ou 5173 sont déjà utilisés, modifiez les dans les fichiers docker-compose :
```yaml
ports:
  - "8080:80"  # Change 3000 to 8080
```

### Problèmes de permissions (Linux)
```bash
sudo chown -R $USER:$USER .
```

### Rebuild complet
```bash
docker compose down
docker system prune -f
docker compose up --build
``` 