# How to Add Protected Routes to App.js

## Step-by-Step Guide

### 1. Import ProtectedRoute Component

Add this import at the top of `src/App.js`:

```javascript
import ProtectedRoute from "./components/ProtectedRoute";
```

### 2. Wrap Protected Routes

Update the routes in `src/App.js` as follows:

#### Public Routes (No Changes)
These routes should remain accessible to everyone:
```javascript
<Route path="/" element={<HomePage/>}></Route>
<Route path="/login" element={<LoginPage/>}></Route>
<Route path="/user-register" element={<UserRegister />} />
<Route path="/home" element={<HomePage />} />
```

#### User Protected Routes
Wrap these routes with `<ProtectedRoute>`:

```javascript
<Route path="/user-home" element={
  <ProtectedRoute>
    <UserHome />
  </ProtectedRoute>
} />

<Route path="/news/general" element={
  <ProtectedRoute>
    <GeneralNews />
  </ProtectedRoute>
} />

<Route path="/news/politics" element={
  <ProtectedRoute>
    <PoliticsNews />
  </ProtectedRoute>
} />

<Route path="/news/sports" element={
  <ProtectedRoute>
    <SportsNews />
  </ProtectedRoute>
} />

<Route path="/news/technology" element={
  <ProtectedRoute>
    <TechnologyNews />
  </ProtectedRoute>
} />

<Route path="/news/health" element={
  <ProtectedRoute>
    <HealthNews />
  </ProtectedRoute>
} />

<Route path="/news/local" element={
  <ProtectedRoute>
    <LocalNews />
  </ProtectedRoute>
} />

<Route path="/news/world" element={
  <ProtectedRoute>
    <WorldNews />
  </ProtectedRoute>
} />

<Route path="/user-profile" element={
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
} />

<Route path="/SinglePage/:id" element={
  <ProtectedRoute>
    <SinglePage />
  </ProtectedRoute>
} />

<Route path="/SinglePage2/:id" element={
  <ProtectedRoute>
    <SinglePage2 />
  </ProtectedRoute>
} />

<Route path="/SinglePage3/:id" element={
  <ProtectedRoute>
    <SinglePage3 />
  </ProtectedRoute>
} />

<Route path="/news-detail/:id" element={
  <ProtectedRoute>
    <NewsDetails />
  </ProtectedRoute>
} />
```

#### Admin Protected Routes
Wrap these routes with `<ProtectedRoute requireAdmin={true}>`:

```javascript
<Route path="/login/admin-home" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminHome />
  </ProtectedRoute>
} />

<Route path="/AdminNav" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminNav />
  </ProtectedRoute>
} />

<Route path="/AddNews" element={
  <ProtectedRoute requireAdmin={true}>
    <AddNews />
  </ProtectedRoute>
} />

<Route path="/AddAdv" element={
  <ProtectedRoute requireAdmin={true}>
    <AddAdv />
  </ProtectedRoute>
} />

<Route path="/ViewNews" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminViewNews />
  </ProtectedRoute>
} />

<Route path="/ViewAdv" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminViewAds />
  </ProtectedRoute>
} />

<Route path="/edit-news/:id" element={
  <ProtectedRoute requireAdmin={true}>
    <EditNews />
  </ProtectedRoute>
} />

<Route path="/edit-adv/:id" element={
  <ProtectedRoute requireAdmin={true}>
    <EditAdv />
  </ProtectedRoute>
} />
```

### 3. Complete Updated App.js

Here's the complete updated Routes section:

```javascript
import "./App.css";
import "./index.css";
import React from "react";
import Navbar from "./components/Navbar";
import News from "./components/News";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import AdminHome from "./components/adminHome";
import AdminNav from "./components/AdminNav";
import AddNews from "./components/AddNews";
import AddAdv from "./components/AddAdv";
import AdminViewNews from "./components/AdminViewNews";
import EditNews from "./components/EditNews";
import EditAdv from "./components/EditAdv";
import AdminViewAds from "./components/ViewAdv";
import NewsDetails from "./components/NewsDetails";
import HomePage from "./components/HomePage";
import SinglePage from "./components/singlePage/SinglePage";
import UserRegister from "./components/User/Registration/UserRegister";
import UserHome from "./components/User/Home/UserHome";
import GeneralNews from "./components/User/GeneralNews/GeneralNews";
import Politics from "./components/User/Politics/Politics";
import PoliticsNews from "./components/User/Politics/PoliticsNews";
import SportsNews from "./components/User/Sports/SportsNews";
import TechnologyNews from "./components/User/Technology/TechnologyNews";
import HealthNews from "./components/User/Health/HealthNews";
import LocalNews from "./components/User/LocalNews/LocalNews";
import WorldNews from "./components/User/WorldNews/WorldNews";
import UserProfile from "./components/User/UserProfile/UserProfile";
import SinglePage2 from "./components/singlePage/SinglePage2";
import SinglePage3 from "./components/singlePage/SinglePage3";
import ProtectedRoute from "./components/ProtectedRoute"; // ADD THIS

const App = () => {
	const pageSize = 9;
	const apiKey = process.env.REACT_APP_NEWS_API;
	const [progress, setProgress] = useState(0);

	return (
		<div>
			<Router>
				<div>
					<LoadingBar color="#f11946" progress={progress} height={3} />
				</div>
				<Routes>
					{/* Public Routes */}
					<Route path="/" element={<HomePage/>}></Route>
					<Route path="/login" element={<LoginPage/>}></Route>
					<Route path="/home" element={<HomePage />} />
					<Route path="/user-register" element={<UserRegister />} />
					
					{/* Admin Protected Routes */}
					<Route path="/login/admin-home" element={
						<ProtectedRoute requireAdmin={true}>
							<AdminHome />
						</ProtectedRoute>
					} />
					<Route path="/AdminNav" element={
						<ProtectedRoute requireAdmin={true}>
							<AdminNav />
						</ProtectedRoute>
					} />
					<Route path="/AddNews" element={
						<ProtectedRoute requireAdmin={true}>
							<AddNews />
						</ProtectedRoute>
					} />
					<Route path="/AddAdv" element={
						<ProtectedRoute requireAdmin={true}>
							<AddAdv />
						</ProtectedRoute>
					} />
					<Route path="/ViewNews" element={
						<ProtectedRoute requireAdmin={true}>
							<AdminViewNews />
						</ProtectedRoute>
					} />
					<Route path="/ViewAdv" element={
						<ProtectedRoute requireAdmin={true}>
							<AdminViewAds />
						</ProtectedRoute>
					} />
					<Route path="/edit-news/:id" element={
						<ProtectedRoute requireAdmin={true}>
							<EditNews />
						</ProtectedRoute>
					} />
					<Route path="/edit-adv/:id" element={
						<ProtectedRoute requireAdmin={true}>
							<EditAdv />
						</ProtectedRoute>
					} />
					
					{/* User Protected Routes */}
					<Route path="/user-home" element={
						<ProtectedRoute>
							<UserHome />
						</ProtectedRoute>
					} />
					<Route path="/news/general" element={
						<ProtectedRoute>
							<GeneralNews />
						</ProtectedRoute>
					} />
					<Route path="/news/politics" element={
						<ProtectedRoute>
							<PoliticsNews />
						</ProtectedRoute>
					} />
					<Route path="/news/sports" element={
						<ProtectedRoute>
							<SportsNews />
						</ProtectedRoute>
					} />
					<Route path="/news/technology" element={
						<ProtectedRoute>
							<TechnologyNews />
						</ProtectedRoute>
					} />
					<Route path="/news/health" element={
						<ProtectedRoute>
							<HealthNews />
						</ProtectedRoute>
					} />
					<Route path="/news/local" element={
						<ProtectedRoute>
							<LocalNews />
						</ProtectedRoute>
					} />
					<Route path="/news/world" element={
						<ProtectedRoute>
							<WorldNews />
						</ProtectedRoute>
					} />
					<Route path="/user-profile" element={
						<ProtectedRoute>
							<UserProfile />
						</ProtectedRoute>
					} />
					<Route path="/SinglePage/:id" element={
						<ProtectedRoute>
							<SinglePage />
						</ProtectedRoute>
					} />
					<Route path="/SinglePage2/:id" element={
						<ProtectedRoute>
							<SinglePage2 />
						</ProtectedRoute>
					} />
					<Route path="/SinglePage3/:id" element={
						<ProtectedRoute>
							<SinglePage3 />
						</ProtectedRoute>
					} />
					<Route path="/news-detail/:id" element={
						<ProtectedRoute>
							<NewsDetails />
						</ProtectedRoute>
					} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
```

## What This Does

### ProtectedRoute Component
- **Checks authentication** - Verifies user has valid JWT tokens
- **Redirects if not authenticated** - Sends user to `/login` page
- **Preserves location** - Saves the attempted URL to redirect back after login

### requireAdmin Prop
- **When `requireAdmin={true}`** - Route requires admin privileges
- **Checks `is_superuser`** - Verifies user is an admin
- **Redirects non-admins** - Sends regular users to `/user-home`

## Benefits

1. ✅ **Prevents unauthorized access** - Users must be logged in
2. ✅ **Role-based access** - Separate admin and user areas
3. ✅ **Better UX** - Automatic redirect to login
4. ✅ **Security** - Client-side route protection (backed by server-side JWT validation)
5. ✅ **Clean code** - Reusable component for all routes

## Testing

### Test User Routes
1. Logout if logged in
2. Try to access `/user-home` directly
3. Should redirect to `/login`
4. Login as regular user
5. Should access `/user-home` successfully

### Test Admin Routes
1. Login as regular user (not admin)
2. Try to access `/AddNews`
3. Should redirect to `/user-home`
4. Logout and login as admin
5. Should access `/AddNews` successfully

### Test Token Expiry
1. Login successfully
2. Wait for 1 hour (or manually expire token in dev tools)
3. Navigate to any protected route
4. Token should auto-refresh
5. Route should load without redirect to login

## Optional: Show Which Routes are Protected

You can add comments to make it clearer:

```javascript
<Routes>
  {/* ==================== PUBLIC ROUTES ==================== */}
  <Route path="/" element={<HomePage/>}></Route>
  <Route path="/login" element={<LoginPage/>}></Route>
  
  {/* ==================== ADMIN ROUTES (Auth Required) ==================== */}
  <Route path="/login/admin-home" element={
    <ProtectedRoute requireAdmin={true}>
      <AdminHome />
    </ProtectedRoute>
  } />
  
  {/* ==================== USER ROUTES (Auth Required) ==================== */}
  <Route path="/user-home" element={
    <ProtectedRoute>
      <UserHome />
    </ProtectedRoute>
  } />
</Routes>
```

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check localStorage has tokens: `localStorage.getItem('access_token')`
3. Verify Django server is running: http://127.0.0.1:8000
4. Check JWT tokens are being sent in requests (Network tab in DevTools)
5. Verify token hasn't expired

## Next Steps After Adding Protected Routes

1. Test all protected routes
2. Test admin access restrictions
3. Test token refresh on expiry
4. Test logout and re-login flow
5. Update any remaining components to use token storage utilities
