# DevHub – Developer Management Platform

DevHub is a full-stack platform to manage developer profiles, skills, and blogs, built using React, Vite, Firebase, TailwindCSS, and JSON Server.

## Key Features
- Firebase Authentication (Email/Password + Google)
- Form validation with React Hook Form & Yup
- Light/Dark mode support with persistent preference
- Developer search by skill with debounce functionality
- Developer profile with editable fields and blog list
- "No results found" UI for empty search results
- Protected routes with persistent login session
- Responsive, accessible UI with TailwindCSS

## Tech Stack
- **Frontend**: React + Vite
- **Auth**: Firebase
- **Styling**: TailwindCSS
- **Forms**: react-hook-form, yup
- **Routing**: react-router-dom
- **API**: JSON Server (Mock), Axios

## Project Structure
```
src/
├── assets/
├── components/
├── context/
├── pages/
├── routes/
├── services/
├── utils/
├── firebase.js
├── App.jsx
└── main.jsx
```

## Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/irahulk01/devHub.git
cd devhub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment**
Create a `.env` file:
```
VITE_API=http://localhost:3001
VITE_FIREBASE_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESGSENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASURMENT_ID=your_measurement_id
```

4. **Run the project**
```bash
npm run dev
npx json-server --watch db.json --port 3001
```

5. **Firebase Setup**
- Enable Email/Password & Google Sign-In in Firebase Console
- Store extended user data in `/developers` using uid
