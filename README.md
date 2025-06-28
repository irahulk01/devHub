DevHub – Developer Management Hub

DevHub is a full-stack developer management platform built with React + Vite, Firebase Authentication, TailwindCSS, and a mock JSON Server backend. It allows users to register, login, view developer profiles, filter by skills, and explore their blogs.

Features:
- Firebase Auth (Email/Password + Google Login)
- Form validation using React Hook Form + Yup
- Filter/search developers by name or skill
- Profile page with blog list and skills
- Blog API integration via JSON Server
- Protected routes with persistent login
- Responsive design with TailwindCSS

Tech Stack:
- Frontend: React + Vite
- Styling: TailwindCSS
- Forms: react-hook-form, yup, @hookform/resolvers
- Routing: react-router-dom
- Authentication: firebase (auth, firestore)
- Backend API: JSON Server (mock data)
- HTTP client: axios
- Optional DB: Firebase Firestore

Folder Structure:
src/
├── assets/
├── components/
├── context/
├── pages/
├── routes/
├── services/
├── firebase.js
├── App.jsx
├── main.jsx
└── index.css

Setup Instructions:
1. Clone the repository
git clone https://github.com/irahulk01/devHub.git
cd devhub

2. Install dependencies
npm install

3. Create .env file
VITE_API=http://localhost:3001
VITE_FIREBASE_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESGSENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASURMENT_ID=your_measurement_id

4. Start frontend
npm run dev

5. Start backend (JSON server)
npx json-server --watch db.json --port 3001

Firebase Authentication:
- Enable Email/Password and Google in Firebase Console under Authentication.
- Store extended user profile in Firestore: /users/{uid}
- Use uid for secure access control and queries

Authentication Flow:
- Login/Register stores token
- AuthContext uses Firebase Auth state observer
- PrivateRoute redirects unauthorized users
- Firebase ID token persists between refresh

Libraries Used:
- react
- react-dom
- react-router-dom
- firebase
- axios
- tailwindcss
- react-hook-form
- yup
- @hookform/resolvers
- json-server (dev)
