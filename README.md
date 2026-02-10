# 📱 SkillLink — Skill & Service Marketplace Mobile Platform

> A modern mobile application that connects skilled professionals with clients. Built with React Native and Firebase, SkillLink enables service discovery, booking, and provider-client interaction through a secure cloud backend.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Platform](https://img.shields.io/badge/platform-React%20Native-black?style=flat-square)
![Backend](https://img.shields.io/badge/backend-Firebase-orange?style=flat-square)
![Database](https://img.shields.io/badge/database-Firestore-yellow?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

</div>

---

# 🗂️ Table of Contents

- Features  
- About SkillLink  
- Tech Stack  
- Quick Start  
- Installation & Setup  
- Environment Variables  
- Project Structure  
- Architecture  
- Firestore Collections  
- Available Scripts  
- Platform Support  
- Contributing  
- License  
- Support  

---

# 💡 About SkillLink

**SkillLink** is a mobile-first skill & service marketplace app that allows service providers to publish their skills and clients to discover and request services. The platform uses Firebase Authentication and Firestore for secure, real-time cloud data management.

### 🎯 Mission

To make skill-based services easily discoverable and bookable through a secure and user-friendly mobile platform.

---

# ✨ Features

## 👥 User Management
- User registration & login
- Firebase Authentication
- Persistent login sessions
- Profile management
- Role-based users (Client / Provider)

## 🧰 Service Listings
- Create service posts
- Add pricing & descriptions
- Category tagging
- Edit & delete services
- Provider dashboard

## 🔎 Search & Discovery
- Keyword search
- Category filtering
- Skill matching
- Provider profile browsing

## 📅 Booking & Requests
- Service request sending
- Accept / reject workflow
- Status tracking
- Booking history

## ⭐ Ratings & Reviews
- Star rating system
- Written feedback
- Provider rating aggregation

## ☁️ Cloud Features
- Firestore real-time database
- Firebase Storage support (if used)
- Secure rule-based access
- Scalable backend

---

# 🛠️ Tech Stack

## Frontend
- React Native
- Expo (or RN CLI)
- TypeScript / JavaScript
- React Navigation

## Backend (BaaS)
- Firebase Authentication
- Cloud Firestore
- Firebase Storage (optional)

## Utilities & Libraries
- Firebase SDK
- AsyncStorage
- Axios / Fetch
- Form validation libraries

---

# 📦 Quick Start

```bash
git clone https://github.com/Vihanga-Sathsara/SkillLink.git
cd SkillLink
npm install
npx expo start
```

Run on:

- Android Emulator
- iOS Simulator
- Expo Go device

---

# 🚀 Installation & Setup

## ✅ Prerequisites

- Node.js v18+
- Expo CLI

```bash
npm install -g expo-cli
```

- Firebase project

---

## Step 1 — Create Firebase Project

- Open Firebase Console
- Create new project
- Enable:
  - Authentication
  - Firestore Database
  - Storage (optional)

---

## Step 2 — Configure Firebase

Create `.env` file in root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## Step 3 — Run App

```bash
npx expo start
```

---

# 🔐 Environment Variables

```
EXPO_PUBLIC_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_APP_ID
```

⚠️ Never commit `.env` files. Add them to `.gitignore`.

---

# 📁 Project Structure

```
SkillLink/
├── app/
│   ├── screens/
│   ├── navigation/
│   ├── components/
│   ├── modals/
│
├── services/
│   ├── firebase.ts
│   ├── authService.ts
│   ├── serviceService.ts
│   ├── bookingService.ts
│
├── context/
│   ├── AuthContext.tsx
│
├── hooks/
├── assets/
├── types/
├── package.json
├── app.json
└── README.md
```

---

# 🏗️ Architecture

## Mobile Layer
- Screens → UI pages
- Components → Reusable UI
- Context → Global state
- Services → Firebase operations

## Firebase Layer
- Authentication → Login & signup
- Firestore → App data storage
- Storage → Images/files
- Security Rules → Data protection

---

# 🔥 Firestore Collections (Example)

```
users
services
bookings
reviews
categories
messages
```

---

# 📜 Available Scripts

| Script | Description |
|---------|-------------|
expo start | Start development server |
npm run android | Run on Android |
npm run ios | Run on iOS |
npm run web | Run web |
npm run lint | Run linter |

---

# 📱 Platform Support

| Platform | Status |
|------------|----------|
Android | ✅ |
iOS | ✅ |
Expo Go | ✅ |

---

# 🤝 Contributing

1. Fork the repository  
2. Create feature branch  
3. Commit changes  
4. Push branch  
5. Open Pull Request  

---

# 📄 License

MIT License

---

# 💬 Support

- Open a GitHub issue
- Contact project maintainer
- Check documentation

---

# 👨‍💻 Developer

**Vihanga Sathsara**  
SkillLink Mobile App  
Version 1.0.0

---

⭐ If you find this project helpful, give it a star!
