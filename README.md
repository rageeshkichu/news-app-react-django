# 📰 Full Stack News Application (React + Django + Redux)

A full-stack news application built using **React**, **Redux Toolkit (Thunk)**, and **Django REST Framework**.  
The application fetches news from a Django backend API and displays them with a modern, responsive user interface.

This project demonstrates **real-world full stack development practices** including API integration, global state management, async data fetching, and UI/UX enhancements.

---

## 🚀 Features

- 🔐 User authentication based content access
- 📰 Fetch news articles from Django REST API
- ⚡ Redux Thunk for async API state management
- 🔄 Global state management using Redux
- ⏳ Loading spinner during API calls
- ❌ Error handling with toast notifications
- 🖼 Image fallback handling
- 📱 Fully responsive UI
- 🔗 Dynamic routing using React Router
- 🎨 Modern UI/UX styling

---

## 🛠 Tech Stack

### Frontend

- React.js
- Redux (Thunk Middleware)
- React Router DOM
- Axios
- React Toastify
- CSS / Tailwind CSS (if applicable)

### Backend

- Django
- Django REST Framework
- MySQL / SQLite (Database)
- REST API Architecture

---

## 📁 Project Structure

frontend/
┣ components/
┣ redux/
┃ ┣ actions/
┃ ┣ reducers/
┃ ┗ store.js
┣ pages/
┗ App.js

backend/
┣ api/
┣ models/
┣ serializers/
┣ views/
┗ urls.py



---

## ⚙ Installation & Setup

### 🔹 Backend Setup (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


Backend will run at:
http://localhost:8000


Frontend Setup (React)
cd frontend
npm install
npm start


Frontend will run at:
http://localhost:3000


Redux Implementation
Flow:
Component → Dispatch Action → API Call → Reducer → Store → UI Update


