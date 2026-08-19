# 🔐 Authentication Guide

## Admin Login Credentials

### Default Credentials (Temporary)
```
Email: admin@gmail.com
Password: Admin@123
```

⚠️ **Note**: These are temporary demo credentials for development purposes only.

---

## How It Works

### 1. **Login Flow**
```
User visits any page
  ↓
Redirected to /login
  ↓
Enter credentials
  ↓
Credentials validated (client-side)
  ↓
Session stored in sessionStorage
  ↓
Redirected to /dashboard
```

### 2. **Protected Routes**
The `/dashboard` route is protected and requires authentication:
- Checks for authentication on page load
- Redirects to `/login` if not authenticated
- Shows loading spinner during check

### 3. **Session Management**
- **Storage**: `sessionStorage.setItem('isAdminAuthenticated', 'true')`
- **Duration**: Session lasts until browser tab/window is closed
- **Logout**: Removes session and redirects to login

---

## Route Structure

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page (redirects to login) |
| `/login` | Public | Login page |
| `/dashboard` | Protected | Admin dashboard (requires auth) |

---

## Authentication Features

### ✅ Login Page
- Email and password fields
- Form validation
- Error messages for invalid credentials
- Loading state during submission
- Demo credentials hint
- Dark mode support

### ✅ Dashboard Protection
- Authentication check on mount
- Redirect to login if not authenticated
- Loading state during auth check
- Logout button in header

### ✅ Logout Functionality
- Logout button in dashboard header
- Clears session storage
- Redirects to login page
- Prevents back button access

---

## Code Implementation

### Login Component (`app/login/page.tsx`)
```typescript
const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'Admin@123',
};

// Validates credentials and stores session
if (email === ADMIN_CREDENTIALS.email && 
    password === ADMIN_CREDENTIALS.password) {
  sessionStorage.setItem('isAdminAuthenticated', 'true');
  router.push('/dashboard');
}
```

### Dashboard Protection (`app/dashboard/page.tsx`)
```typescript
useEffect(() => {
  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuth) {
      router.push('/login');
    }
  };
  checkAuth();
}, [router]);
```

### Logout Handler
```typescript
const handleLogout = () => {
  sessionStorage.removeItem('isAdminAuthenticated');
  router.push('/login');
};
```

---

## Security Notes

### ⚠️ Current Implementation
The current authentication is **client-side only** and uses hardcoded credentials. This is suitable for:
- Development/demo purposes
- Local testing
- Proof of concept

### 🔒 Production Recommendations

For production use, you should implement:

1. **Backend Authentication**
   - Use your actual API's login endpoint
   - Verify credentials server-side
   - Return JWT or session tokens

2. **Secure Token Storage**
   - Use `httpOnly` cookies for tokens
   - Or use secure token storage
   - Never store passwords

3. **API Integration**
   ```typescript
   const response = await fetch('/api/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   const data = await response.json();
   if (data.token) {
     // Store token securely
   }
   ```

4. **Token Validation**
   - Verify token on each protected route
   - Check token expiration
   - Refresh tokens when needed

5. **Environment Variables**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

---

## Upgrading to Real Authentication

### Step 1: Update Login Logic

Replace the hardcoded check with an API call:

```typescript
// app/login/page.tsx
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();
    
    // Store authentication token
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('isAdminAuthenticated', 'true');
    
    router.push('/dashboard');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

### Step 2: Add Token to API Requests

Update the API service to include authentication:

```typescript
// services/api/userService.ts
async getAllUsers(): Promise<User[]> {
  const token = sessionStorage.getItem('authToken');
  
  const response = await fetch(`${API_CONFIG.BASE_URL}/users`, {
    method: HTTP_METHODS.GET,
    headers: {
      ...API_CONFIG.HEADERS,
      'Authorization': `Bearer ${token}`,
    },
  });
  
  // Handle response
}
```

### Step 3: Add Token Refresh

Implement token refresh logic:

```typescript
// utils/auth.ts
export async function refreshToken() {
  const token = sessionStorage.getItem('authToken');
  
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (response.ok) {
    const data = await response.json();
    sessionStorage.setItem('authToken', data.token);
  }
}
```

---

## Testing Authentication

### Test Login
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Should redirect to `/login`
4. Enter credentials:
   - Email: `admin@gmail.com`
   - Password: `Admin@123`
5. Should redirect to `/dashboard`

### Test Logout
1. Click "Logout" button in dashboard
2. Should redirect to `/login`
3. Session should be cleared

### Test Protected Route
1. Try accessing `/dashboard` directly without login
2. Should redirect to `/login`
3. After login, `/dashboard` should be accessible

---

## Troubleshooting

### Issue: Stuck on login page after successful login
**Solution**: Check browser console for errors. Ensure router is working.

### Issue: Dashboard accessible without login
**Solution**: Check authentication check in `useEffect`. Clear browser storage and try again.

### Issue: Logout doesn't work
**Solution**: Verify `sessionStorage.removeItem()` is being called. Check browser dev tools → Application → Session Storage.

---

## Summary

✅ **Login page** at `/login` with demo credentials  
✅ **Protected dashboard** at `/dashboard`  
✅ **Logout functionality** in header  
✅ **Session management** with sessionStorage  
✅ **Route protection** with redirect  
✅ **Loading states** for better UX  

### Current Status
- ✅ Client-side authentication implemented
- ✅ Login/logout working
- ⏳ Backend integration ready for upgrade
- ⏳ JWT tokens ready to implement

---

**Quick Access:**
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard` (requires login)

**Demo Credentials:**
- Email: `admin@gmail.com`
- Password: `Admin@123`
