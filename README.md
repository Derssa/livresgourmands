# 📚 livresgourmands.net

## 📖 Description du projet

**livresgourmands.net** est une plateforme de commerce électronique spécialisée dans la vente de **livres de cuisine** pour tous les niveaux (débutants, amateurs, chefs).  
Le projet inclut :

- Un **Front Office** pour les internautes, clients et amis (navigation, panier, listes de cadeaux, avis/commentaires).
- Un **Back Office** pour les éditeurs, gestionnaires et administrateurs (gestion du catalogue, des stocks, des utilisateurs et validation des commentaires).
- Un module de **paiement en ligne sécurisé** via un prestataire externe (Stripe).

L’application sera construite avec :

- **Frontend** : React (Interface Back Office), Next.js (Interface Front Office).
- **Backend** : Node.js + Express (API REST).
- **Base de données** : MySQL.
- **Authentification** : JWT + bcrypt.
- **Paiement** : Stripe.
- **Tests** : Jest, Cypress.
- **Déploiement** : Netlify (frontend), Render/Heroku (backend).

---

## 🎯 Objectifs semaine par semaine

### Septembre 2025

- **Semaine du 3 sept.** :
  - Mise en place du dépôt GitHub, création du README initial.
  - Analyse des besoins et identification des acteurs.
- **Semaine du 10 sept.** :
  - Réalisation du diagramme de cas d’utilisation.
  - Première ébauche du diagramme de classes.
- **Semaine du 17 sept.** :
  - Mise en place du projet backend (Node.js + Express).
  - Configuration de la base MySQL et migrations initiales.

### Octobre 2025

- **Semaine du 1 oct.** :
  - Développement des modèles principaux : Utilisateur, Livre, Commande, Panier.
  - Mise en place de l’authentification (JWT, bcrypt).
- **Semaine du 8 oct.** :
  - API CRUD pour livres, utilisateurs et commandes.
  - Tests unitaires backend (Jest).
- **Semaine du 15 oct.** :
  - Début développement Front Office (Next.js) : navigation, recherche, fiche livre.
- **Semaine du 22 oct.** :
  - Début développement Back Office (React) : gestion des catégories et catalogue.
- **Semaine du 29 oct.** :
  - Intégration Panier + Commande côté Client (Next.js).
  - Intégration gestion stock côté Gestionnaire (React).

### Novembre 2025

- **Semaine du 5 nov.** :
  - Implémentation des Listes de cadeaux (côté Client et Ami).
- **Semaine du 12 nov.** :
  - Intégration du module Stripe (paiement en ligne sécurisé).
- **Semaine du 19 nov.** :
  - Validation des commentaires (Éditeur - Back Office).
- **Semaine du 26 nov.** :
  - Historique commandes et paiements (Client, Administrateur).

### Décembre 2025

- **Semaine du 3 déc.** :
  - Optimisation des API (sécurité, pagination, filtres).
- **Semaine du 10 déc.** :
  - Finalisation Front Office (avis, commentaires, listes partagées).
- **Semaine du 17 déc.** :
  - Finalisation Back Office (rapports, suivi ventes, gestion utilisateurs).
- **Semaine du 24 déc.** :
  - Tests E2E avec Cypress (panier, paiement, commandes).
- **Semaine du 31 déc.** :
  - Correction des bugs et stabilisation.

### Janvier 2026

- **Semaine du 7 janv.** :
  - Préparation au déploiement (Netlify, Render/Heroku).
  - Documentation utilisateur.
- **Semaine du 14 janv.** :
  - Livraison finale du projet.
  - Présentation et remise officielle.

---

## 👥 Répartition des rôles et responsabilités

- **Youssef MOINOU** :

  - Développement **Front End Client/Ami** avec **Next.js (SSR)** (panier, commandes, listes de cadeaux, avis, commentaires) et optimisation SEO et performance grâce au rendu côté serveur.
  - Intégration avec l’API (gestion catalogue, stocks, utilisateurs, validation des commentaires).

- **Mohammed ATMANE** :

  - Développement **Front End Back Office** avec **React** (administrateur, gestionnaire, éditeur).
  - Intégration avec l’API (gestion catalogue, stocks, utilisateurs, validation des commentaires).

- **Les deux ensemble** :
  - Conception et gestion de la **base de données** MySQL.
  - Développement et sécurisation de l’**API backend** (Node.js/Express).
  - Intégration du module de **paiement Stripe**.
  - Rédaction des tests (unitaires et E2E).

---

## 📅 Date et équipe

- **Date de début** : 3 septembre 2025
- **Date de fin prévue** : 14 janvier 2026
- **Membres de l’équipe** :
  - Youssef MOINOU
  - Mohammed ATMANE

---
