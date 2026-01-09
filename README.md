# Wallet Application

Ce projet est une application web de gestion de portefeuille, développée avec une architecture client-serveur.

## Motivations

Les principales motivations derrière la création de ce projet sont :

- **Apprentissage et veille technologique :** Se rafraîchir les idées sur les technologies front-end (React) et back-end (Express.js).
- **Développement full-stack :** Expérimenter le processus de création d'une application web complète de zéro.
- **Déploiement :** Anticiper et intégrer les contraintes liées au déploiement sur une plateforme de type "Platform as a Service" (PaaS).
- **Intelligence Artificielle et développement :** Utiliser activement l'IA, notamment GitHub Copilot, pour assister le développement, comprendre ses capacités et identifier ses limites dans un contexte de projet réel.

## Architecture

Le projet est organisé en deux répertoires distincts :

- `client/` : Contient le code source de l'application front-end développée avec React.
- `server/` : Contient le code source du serveur back-end et de l'API REST, développés avec Express.js.

### Mode Développement

En environnement de développement, l'architecture est conçue pour faciliter le développement rapide et les itérations.

```
+-----------------+      +------------------------+      +------------------+
|                 |      |                        |      |                  |
|    Navigateur   |----->|   Serveur Dev VITE     |----->|  Serveur Express |
| (Code React)    |      | (Proxy vers /api)      |      |    (API REST)    |
|                 |      |                        |      |                  |
+-----------------+      +------------------------+      +------------------+
```

- Le **navigateur** exécute le code React.
- Le **serveur de développement Vite** sert l'application React et rafraîchit la page à chaque modification du code (`Hot Module Replacement`). Il est également configuré comme un **proxy** : toutes les requêtes commençant par `/api` sont redirigées vers le serveur Express.
- Le **serveur Express** implémente l'API REST qui gère la logique métier et les données.

Grâce à cette configuration, du point de vue du navigateur, toutes les requêtes semblent être adressées à un seul et même serveur (Vite), ce qui évite les problèmes de CORS.

Pour lancer l'environnement de développement, une seule commande est nécessaire :

```bash
npm run dev
```
puis depuis un browser http://localhost:5173

Ce script se charge de démarrer simultanément le serveur Vite et le serveur Express.

### Mode Production

En production, l'architecture est optimisée pour la performance et la simplicité de déploiement.

```
+-----------------+      +------------------------------------+
|                 |      |                                    |
|    Navigateur   |----->|          Serveur Express           |
|                 |      | (Sert les fichiers statiques React |
|                 |      |      et implémente l'API REST)     |
+-----------------+      |                                    |
                       +------------------------------------+
```

1.  **Build du client :** Le code de l'application React est compilé et optimisé via une commande de build (par exemple `npm run build`). Cette étape génère des fichiers statiques (HTML, CSS, JavaScript) dans un répertoire `dist` du serveur Express. Cela est realisé par configuration de Vite dans vite.config.js.
2.  **Service unifié :** Le contenu du répertoire `dist` est ensuite servi directement par le serveur Express en tant que ressources statiques.

Dans ce mode, le **serveur Express** a une double responsabilité :
- Servir l'application React "buildée" au navigateur.
- Implémenter l'API REST.

Le navigateur n'interagit plus qu'avec une seule entité : le serveur Express.

Pour lancer l'environnement de production localement, deux commandes sont nécessaires :

```bash
npm run build
npm run server
```
puis depuis un browser http://localhost:3001
