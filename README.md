# Elliora Banking - Application Bancaire Web

Une application bancaire moderne développée avec Next.js, TypeScript et Tailwind CSS, offrant une interface intuitive pour la gestion des comptes bancaires.

## 🎯 Fonctionnalités

- **Authentification sécurisée** : Système de connexion avec validation
- **Dashboard** : Vue d'ensemble des comptes avec soldes formatés en XAF
- **Gestion des transactions** : Liste avec recherche, tri, pagination et filtres
- **Virements** : Initiation de virements avec validation et confirmation
- **Interface responsive** : Design adaptatif pour tous les écrans
- **Animations fluides** : Transitions et animations avec Framer Motion
- **Notifications** : Feedback utilisateur avec Sonner

## 🛠️ Stack Technique

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS, Radix UI
- **Animations** : Framer Motion
- **Notifications** : Sonner
- **Tests** : Jest, React Testing Library
- **Linting** : ESLint

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn

## 🚀 Installation et Démarrage

### 1. Installation des dépendances

```bash
npm install
```

### 2. Démarrage en mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### 3. Compilation pour la production

```bash
npm run build
npm start
```

## 🧪 Tests

### Lancer tous les tests

```bash
npm test
```

### Tests en mode watch

```bash
npm run test:watch
```

### Tests inclus

- **validateTransfer.test.ts** : Validation des montants et numéros de compte
- **formatCurrency.test.ts** : Formatage correct des montants en XAF

## 🔐 Comptes de Test

Pour tester l'application, utilisez les identifiants suivants :

- **Nom d'utilisateur** : `alice`
- **Mot de passe** : `password123`

## 📁 Structure du Projet

```
/app
├── /api                    # API Routes
│   ├── /auth              # Authentification
│   ├── /accounts          # Gestion des comptes
│   └── /transfer          # Virements
├── /login                 # Page de connexion
├── /dashboard             # Dashboard principal
├── layout.tsx             # Layout global
└── globals.css            # Styles globaux

/components
├── AccountCard.tsx        # Carte de compte
├── TransactionsList.tsx   # Liste des transactions
└── TransferModal.tsx      # Modal de virement

/lib
├── api.ts                # Fonctions API
├── auth.ts               # Gestion de l'authentification
├── format.ts             # Formatage des données
└── validate.ts           # Validations

/tests
├── validateTransfer.test.ts # Tests de validation
└── formatCurrency.test.ts   # Tests de formatage
```

## 🎮 Utilisation

### 1. Connexion
- Accédez à l'application
- Entrez les identifiants de test
- Vous serez redirigé vers le dashboard

### 2. Consultation des Comptes
- Visualisez vos comptes avec soldes
- Cliquez sur "Voir transactions" pour l'historique
- Utilisez "Faire un virement" pour initier un transfert

### 3. Gestion des Transactions
- Recherchez par description
- Triez par date ou montant
- Naviguez avec la pagination

### 4. Virements
- Sélectionnez le compte source
- Entrez le numéro de compte bénéficiaire
- Spécifiez le montant (validation automatique)
- Confirmez la transaction

## 🔧 API Mock

L'application utilise des APIs simulées :

### Endpoints disponibles

- `POST /api/auth/login` - Authentification
- `GET /api/accounts` - Liste des comptes
- `GET /api/accounts/[id]/transactions` - Transactions d'un compte
- `POST /api/transfer` - Initiation de virement

### Données de test

**Comptes disponibles** :
- Compte Courant (acc_1) : 542,300 XAF
- Compte Épargne (acc_2) : 1,200,000 XAF

**Transactions simulées** : Historique avec différents types d'opérations

## 🎨 Interface Utilisateur

- **Design moderne** : Interface claire et intuitive
- **Thème cohérent** : Palette de couleurs professionnelle
- **Responsive** : Optimisé pour mobile, tablette et desktop
- **Accessibilité** : Composants accessibles avec Radix UI
- **Performance** : Chargement rapide et animations fluides

## 🚀 Fonctionnalités Avancées

- **Validation côté client** : Contrôles en temps réel
- **Gestion d'erreurs** : Messages d'erreur contextuels
- **États de chargement** : Indicateurs visuels
- **Pagination** : Navigation efficace dans les listes
- **Filtrage** : Recherche et tri des transactions
- **Confirmations** : Modales de confirmation pour les actions sensibles

## 📱 Responsive Design

L'application s'adapte automatiquement à tous les types d'écrans :
- **Mobile** : Interface optimisée tactile
- **Tablette** : Layout adaptatif
- **Desktop** : Utilisation complète de l'espace

## 🔒 Sécurité

- Validation côté client et serveur
- Gestion sécurisée des tokens
- Vérification des soldes avant virement
- Protection contre les montants invalides

## 📊 Performances

- **Bundle optimisé** : Code splitting automatique
- **Images optimisées** : Next.js Image component
- **Caching intelligent** : Stratégies de cache
- **Animations performantes** : GPU-accelerated avec Framer Motion

## 🎬 Démo

[Lien vers la vidéo de démonstration] - À ajouter après déploiement

## 📄 Licence

Ce projet est développé à des fins de démonstration.

---

**Développé avec ❤️ par l'équipe Elliora Banking**