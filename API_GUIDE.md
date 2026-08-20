# API Configuration Guide

## Overview
This application now uses local Next.js API routes to serve mock user data. This ensures the application works immediately without requiring an external backend.

## API Endpoints

### Base URL
```
/api
```

### Available Endpoints

#### 1. Get All Users
```http
GET /api/users
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Rajesh Kumar",
    "email": "rajesh.kumar@example.com",
    "role": "investor",
    "status": "active",
    "phoneNumber": "+91 98765 43210",
    "dateJoined": "2024-01-15T10:30:00Z",
    "investmentCount": 5,
    "totalInvestment": 250000,
    "verified": true
  },
  ...
]
```

#### 2. Get User by ID
```http
GET /api/users/[id]
```

**Response:**
```json
{
  "id": "1",
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@example.com",
  "role": "investor",
  "status": "active",
  "phoneNumber": "+91 98765 43210",
  "dateJoined": "2024-01-15T10:30:00Z",
  "investmentCount": 5,
  "totalInvestment": 250000,
  "verified": true,
  "address": "123 MG Road, Bangalore, Karnataka",
  "panNumber": "ABCDE1234F",
  "kycStatus": "completed"
}
```

#### 3. Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "role": "investor",
  "status": "pending",
  "phoneNumber": "+91 98765 43219",
  "verified": false
}
```

#### 4. Update User
```http
PUT /api/users/[id]
```

**Request Body:**
```json
{
  "status": "active",
  "verified": true
}
```

#### 5. Delete User
```http
DELETE /api/users/[id]
```

## File Structure

```
app/
└── api/
    └── users/
        ├── route.ts           # GET /api/users, POST /api/users
        └── [id]/
            └── route.ts       # GET, PUT, DELETE /api/users/[id]
```

## Configuration

The API configuration is centralized in `services/api/config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: '/api',  // Local Next.js API routes
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  CACHE_POLICY: 'no-store' as RequestCache,
} as const;
```

## Mock Data

The API routes currently use in-memory mock data with 8 sample users:

1. Rajesh Kumar - Active, Verified
2. Priya Sharma - Active, Verified
3. Amit Patel - Inactive, Unverified
4. Sneha Gupta - Active, Verified
5. Vikram Singh - Active, Verified
6. Anita Reddy - Pending, Unverified
7. Karthik Menon - Active, Verified
8. Deepika Rao - Active, Verified

## Switching to Real Backend

When you're ready to connect to a real backend API:

1. Update `services/api/config.ts`:
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'https://your-api-domain.com/api',
     // ... rest of config
   };
   ```

2. (Optional) Delete the mock API routes:
   ```bash
   Remove-Item -Recurse app/api/users
   ```

3. Update authentication if needed in `userService.ts`:
   ```typescript
   headers: {
     ...API_CONFIG.HEADERS,
     'Authorization': `Bearer ${token}`,
   }
   ```

## Service Layer

All API calls go through the `UserService` class in `services/api/userService.ts`:

```typescript
import { userService } from '@/services/api/userService';

// Get all users
const users = await userService.getAllUsers();

// Get specific user
const user = await userService.getUserById('1');

// Create user
const newUser = await userService.createUser({ ... });

// Update user
const updated = await userService.updateUser('1', { ... });

// Delete user
await userService.deleteUser('1');
```

## Error Handling

The service includes comprehensive error handling:

- Network errors
- HTTP status code errors
- JSON parsing errors
- Console logging for debugging

## Testing the API

Using PowerShell:
```powershell
# Get all users
(Invoke-WebRequest -Uri http://localhost:3000/api/users -UseBasicParsing).Content

# Get specific user
(Invoke-WebRequest -Uri http://localhost:3000/api/users/1 -UseBasicParsing).Content
```

Using curl:
```bash
# Get all users
curl http://localhost:3000/api/users

# Get specific user
curl http://localhost:3000/api/users/1

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## Redux Integration

User data is managed through Redux:

```typescript
// Dispatch action to fetch users
dispatch(fetchUsers());

// Access users from state
const users = useAppSelector((state) => state.users.users);

// Fetch specific user
dispatch(fetchUserById('1'));
```

## Troubleshooting

### Users not loading
1. Check browser console for errors
2. Verify API route exists: http://localhost:3000/api/users
3. Check `services/api/config.ts` has correct BASE_URL
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### API returns 404
- Ensure dev server is running
- Check file paths in `app/api/users/`
- Restart dev server

### CORS errors
- Not applicable for local Next.js API routes
- If using external API, configure CORS on backend

## Future Enhancements

- [ ] Add pagination support
- [ ] Add filtering and search
- [ ] Add sorting options
- [ ] Implement authentication tokens
- [ ] Add request caching
- [ ] Add rate limiting
- [ ] Implement WebSocket for real-time updates

---

**Status:** ✅ Working with mock data
**Last Updated:** API routes created and tested successfully
