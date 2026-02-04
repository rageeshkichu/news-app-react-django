# 📰 Full Stack News Application (React + Django + Redux)

A full-stack news application built using **React**, **Redux Toolkit (Thunk)**, and **Django REST Framework**.  
The application features JWT authentication, protected routes, code splitting, and fetches news from a Django backend API with a modern, responsive user interface.

This project demonstrates **real-world full stack development practices** including JWT authentication, protected routes, API integration, global state management, async data fetching, code splitting for performance optimization, and modern UI/UX enhancements.

---

## 🚀 Features

- 🔐 **JWT Authentication** - Secure user authentication with access and refresh tokens
- 🛡️ **Protected Routes** - Route-level authorization and access control
- 📰 **News Management** - Fetch and display news articles from Django REST API
- ⚡ **Redux Thunk** - Async API state management with Redux Toolkit
- 🔄 **Global State Management** - Centralized state using Redux
- 📦 **Code Splitting** - Lazy loading components for optimized performance
- ⏳ **Loading States** - Loading spinner during API calls
- ❌ **Error Handling** - Toast notifications for user feedback
- 🖼️ **Image Fallback** - Graceful image loading with fallback support
- 📱 **Fully Responsive UI** - Mobile-first design approach
- 🔗 **Dynamic Routing** - React Router DOM with protected routes
- 🎨 **Modern UI/UX** - Clean and intuitive interface

---

## 🛠 Tech Stack

### Frontend

- **React.js** - UI library
- **Redux Toolkit** - State management with Thunk middleware
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **CSS** - Custom styling

### Backend

- **Django** - Python web framework
- **Django REST Framework** - RESTful API development
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **MySQL / SQLite** - Database
- **CORS Headers** - Cross-origin resource sharing

---

## 📁 Project Structure

```
news-app-react-django/
├── newss_app/                    # Frontend React application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── redux/                # Redux store, actions, and reducers
│   │   │   ├── actions/          # Redux action creators
│   │   │   ├── reducers/         # Redux reducers
│   │   │   └── store.js          # Redux store configuration
│   │   ├── pages/                # Page components
│   │   ├── routes/               # Route configuration
│   │   ├── utils/                # Utility functions
│   │   └── App.js                # Main App component
│   └── package.json              # Frontend dependencies
│
├── backend/                      # Django backend
│   ├── backend/                  # Django project settings
│   │   ├── settings.py           # Project configuration
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py               # WSGI configuration
│   ├── myapp/                    # Main Django app
│   │   ├── models.py             # Database models
│   │   ├── serializers.py        # DRF serializers
│   │   ├── views.py              # API views
│   │   └── urls.py               # App URL routing
│   ├── media/                    # Media files (uploads)
│   ├── manage.py                 # Django management script
│   └── .env.example              # Environment variables template
│
├── JWT_IMPLEMENTATION.md         # JWT authentication documentation
├── JWT_IMPLEMENTATION_SUMMARY.md # JWT implementation summary
├── CODE_SPLITTING_IMPLEMENTATION.md # Code splitting guide
├── PROTECTED_ROUTES_GUIDE.md     # Protected routes documentation
└── README.md                     # Project documentation
```

---

## ⚙ Installation & Setup

### Prerequisites

- **Python 3.8+**
- **Node.js 14+** and **npm**
- **MySQL** (or SQLite for development)

### 🔹 Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (database, secret key, etc.)
   ```

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server:**
   ```bash
   python manage.py runserver
   ```

   Backend will run at: **http://localhost:8000**

---

### 🔹 Frontend Setup (React)

1. **Navigate to frontend directory:**
   ```bash
   cd newss_app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   - Create a `.env` file in the `newss_app` directory
   - Add your backend API URL:
     ```
     REACT_APP_API_URL=http://localhost:8000/api
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```

   Frontend will run at: **http://localhost:3000**

---

## 🔐 JWT Authentication

This application implements JWT (JSON Web Token) authentication for secure user sessions:

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for obtaining new access tokens
- **Token Storage**: Secure storage in httpOnly cookies or localStorage
- **Token Refresh**: Automatic token refresh on expiration

For detailed implementation, see [JWT_IMPLEMENTATION.md](./JWT_IMPLEMENTATION.md)

---

## 🛡️ Protected Routes

Protected routes ensure that certain pages are only accessible to authenticated users:

- **Public Routes**: Login, Register, Home
- **Private Routes**: Dashboard, Profile, News Management
- **Route Guards**: Automatic redirection for unauthorized access

For detailed implementation, see [PROTECTED_ROUTES_GUIDE.md](./PROTECTED_ROUTES_GUIDE.md)

---

## 📦 Code Splitting

The application uses React code splitting with `React.lazy()` and `Suspense` for:

- Reduced initial bundle size
- Faster initial page load
- Lazy loading of route components
- Better performance and user experience

For detailed implementation, see [CODE_SPLITTING_IMPLEMENTATION.md](./CODE_SPLITTING_IMPLEMENTATION.md)

---

## 🔄 Redux Implementation

### Flow:
```
Component → Dispatch Action → API Call (Thunk) → Reducer → Store → UI Update
```

### Key Concepts:
- **Actions**: Define what happened
- **Thunks**: Handle async logic (API calls)
- **Reducers**: Update state based on actions
- **Store**: Single source of truth for application state
- **Selectors**: Extract data from store

---

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployments from main branch
- Configure environment variables in Vercel dashboard

### Backend
- Can be deployed to:
  - **Heroku**
  - **Railway**
  - **AWS EC2**
  - **DigitalOcean**
  - **PythonAnywhere**

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh access token
- `POST /api/auth/logout/` - User logout

### News
- `GET /api/news/` - Get all news articles
- `GET /api/news/:id/` - Get single news article
- `POST /api/news/` - Create news article (authenticated)
- `PUT /api/news/:id/` - Update news article (authenticated)
- `DELETE /api/news/:id/` - Delete news article (authenticated)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Ambadi G**

- GitHub: [@rageeshkichu](https://github.com/rageeshkichu)
- Project Link: [https://github.com/rageeshkichu/news-app-react-django](https://github.com/rageeshkichu/news-app-react-django)

---

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

## 🙏 Acknowledgments

- Django REST Framework Documentation
- React.js Documentation
- Redux Toolkit Documentation
- JWT.io for token standards
