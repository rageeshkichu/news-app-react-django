# JWT Authentication Implementation

## Overview
This project uses JWT (JSON Web Tokens) for authentication instead of session-based authentication. JWT provides a stateless, secure way to authenticate users and protect API endpoints.

## Features

### Backend (Django)
- **djangorestframework-simplejwt** - JWT implementation
- **Token Blacklisting** - Invalidate tokens on logout
- **Token Refresh** - Automatic token renewal without re-authentication
- **1-hour access token lifetime** - Short-lived tokens for security
- **7-day refresh token lifetime** - Long-lived refresh tokens
- **Automatic token rotation** - New refresh token on each refresh

### Frontend (React)
- **Automatic token attachment** - JWT tokens added to all API requests
- **Token refresh on expiry** - Seamless token renewal when access token expires
- **Secure token storage** - Tokens stored in localStorage
- **Protected routes** - Route guards for authenticated pages
- **Auto-redirect on authentication failure** - Redirect to login when unauthorized

## API Endpoints

### Authentication Endpoints

#### Login
```
POST /api/loginUser/
```
**Request:**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "user_id": 1,
  "username": "user123",
  "is_superuser": false
}
```

#### Token Refresh
```
POST /api/token/refresh/
```
**Request:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbG...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

#### Token Verify
```
POST /api/token/verify/
```
**Request:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

**Response:**
```json
{}
```
*Returns 200 if token is valid, 401 if invalid*

#### Logout
```
POST /api/logout/
```
**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbG..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Frontend Implementation

### Token Storage Utility
Located at: `src/utils/tokenStorage.js`

**Functions:**
- `saveTokens(accessToken, refreshToken, userId, isSuperuser, username)` - Save authentication data
- `getAccessToken()` - Get current access token
- `getRefreshToken()` - Get current refresh token
- `getUserId()` - Get logged-in user ID
- `getIsSuperuser()` - Check if user is admin
- `getUsername()` - Get logged-in username
- `isAuthenticated()` - Check if user is logged in
- `clearTokens()` - Clear all authentication data
- `updateAccessToken(accessToken)` - Update access token after refresh
- `getUserData()` - Get all user data at once

### API Client with Interceptors
Located at: `src/api/apiClient.js`

**Features:**
- Automatically adds `Authorization: Bearer <token>` header to all requests
- Intercepts 401 responses and automatically refreshes the token
- Retries failed requests after token refresh
- Queues multiple failed requests and processes them after refresh
- Redirects to login if token refresh fails

**Usage:**
```javascript
import api from '../api/client';

// All requests automatically include JWT token
const response = await api.get('/api/news/');
const data = await api.post('/api/addNews/', newsData);
```

### Protected Routes
Located at: `src/components/ProtectedRoute.jsx`

**Usage:**
```javascript
import ProtectedRoute from './components/ProtectedRoute';

// Protect user routes
<Route path="/user-home" element={
  <ProtectedRoute>
    <UserHome />
  </ProtectedRoute>
} />

// Protect admin routes
<Route path="/admin-home" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminHome />
  </ProtectedRoute>
} />
```

### Login Component Updates
Located at: `src/components/LoginPage.jsx`

**Changes:**
- Saves JWT tokens on successful login
- Stores user data in localStorage
- Checks authentication status on mount
- Redirects if already authenticated

### Logout Implementation
Updated in:
- `src/components/AdminNav.jsx`
- `src/components/User/UserProfile/UserProfile.jsx`

**Features:**
- Sends refresh token to backend for blacklisting
- Clears all tokens from localStorage
- Clears sessionStorage
- Redirects to login page
- Handles errors gracefully

## Backend Configuration

### settings.py
```python
from datetime import timedelta

INSTALLED_APPS = [
    # ... other apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

### views.py Updates
**Login View:**
- Generates JWT tokens using `RefreshToken.for_user(user)`
- Returns both access and refresh tokens
- Includes user data in response

**Logout View:**
- Accepts refresh token in request body
- Blacklists the token to prevent reuse
- Handles both JWT and session logout

## Token Lifecycle

### 1. Login
```
User enters credentials
    ↓
Backend validates credentials
    ↓
Backend generates access + refresh tokens
    ↓
Frontend stores tokens in localStorage
    ↓
User is redirected to home page
```

### 2. API Requests
```
Frontend makes API request
    ↓
Axios interceptor adds Authorization header
    ↓
Backend validates JWT token
    ↓
Request processed and response returned
```

### 3. Token Expiry
```
API request returns 401 Unauthorized
    ↓
Axios interceptor catches 401 error
    ↓
Interceptor sends refresh token to /api/token/refresh/
    ↓
Backend validates refresh token
    ↓
Backend returns new access token
    ↓
Frontend updates stored access token
    ↓
Original request retried with new token
    ↓
Request succeeds
```

### 4. Logout
```
User clicks logout
    ↓
Frontend sends refresh token to /api/logout/
    ↓
Backend blacklists the refresh token
    ↓
Frontend clears localStorage and sessionStorage
    ↓
User is redirected to login page
```

## Security Considerations

1. **Short Access Token Lifetime** - 1 hour reduces risk if token is stolen
2. **Token Blacklisting** - Prevents use of tokens after logout
3. **HTTPS Required** - Use HTTPS in production to prevent token interception
4. **Secure Storage** - Tokens stored in localStorage (consider httpOnly cookies for enhanced security)
5. **CORS Configuration** - Properly configured to prevent unauthorized origins

## Testing the Implementation

### 1. Test Login
```bash
curl -X POST http://localhost:8000/api/loginUser/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass"}'
```

### 2. Test Protected Endpoint
```bash
curl -X GET http://localhost:8000/api/news/ \
  -H "Authorization: Bearer <access_token>"
```

### 3. Test Token Refresh
```bash
curl -X POST http://localhost:8000/api/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh": "<refresh_token>"}'
```

### 4. Test Logout
```bash
curl -X POST http://localhost:8000/api/logout/ \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token>"}'
```

## Migration from Session-Based Auth

The implementation maintains backward compatibility:
- SessionStorage is still updated for legacy components
- Session authentication is available alongside JWT
- Logout handles both session and JWT cleanup

## Troubleshooting

### Token Expired Error
- **Cause:** Access token lifetime exceeded
- **Solution:** Automatic - interceptor will refresh token
- **Manual:** Call `/api/token/refresh/` endpoint

### Invalid Token Error
- **Cause:** Token tampered or corrupted
- **Solution:** User must log in again

### Token Blacklisted Error
- **Cause:** Token was used after logout
- **Solution:** User must log in again

### CORS Errors
- **Check:** CORS_ALLOW_CREDENTIALS = True in settings.py
- **Check:** CORS_ALLOWED_ORIGINS includes frontend URL
- **Check:** withCredentials: true in axios config

## Future Enhancements

1. **Sliding Token Expiry** - Extend token lifetime on activity
2. **Device Tracking** - Track active sessions per device
3. **Two-Factor Authentication** - Add 2FA to login flow
4. **Token Versioning** - Invalidate all tokens on password change
5. **Rate Limiting** - Limit token refresh attempts
6. **HttpOnly Cookies** - Store tokens in httpOnly cookies instead of localStorage

## References

- [Django REST Framework Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [JWT.io](https://jwt.io/)
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
