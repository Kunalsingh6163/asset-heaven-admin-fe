# Search API Integration Template

## 📝 Fill This Template When You Have the API

### API Details
```
Endpoint URL: _________________________________
Example: https://mobulous-tech.vercel.app/api/users/search

Method: [ ] GET  [ ] POST  [ ] PUT

Query Parameter Name: _________________________
Example: q, search, query, term

Full Example URL: _____________________________
Example: /api/users/search?q=john
```

### Request Format

**If GET Request:**
```
URL Pattern: /users/search?[param_name]=[search_value]

Example:
/api/users/search?q=john
/api/users?search=john&fields=name,email
```

**If POST Request:**
```json
Request Body:
{
  "query": "john",
  // Add other fields if needed
}

OR

{
  "search": "john",
  "fields": ["name", "email"]
}
```

### Response Format

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123",
      "name": "John Doe",
      "email": "john@example.com",
      // ... other user fields
    }
  ],
  "count": 5
}

OR just array:

[
  {
    "_id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

**Where is the users array in response?**
```
[ ] response.data
[ ] response.data.data
[ ] response.data.users
[ ] response (direct array)
[ ] Other: _______________
```

### Headers Required (if any)
```
Authorization: Bearer [token]
Content-Type: application/json
Custom-Header: _________________
```

---

## 🔧 Integration Steps (For Me)

Once you fill the above template, I will:

1. **Update `userService.ts`**
   ```typescript
   async searchUsers(query: string): Promise<User[]> {
     const url = `YOUR_ENDPOINT?YOUR_PARAM=${encodeURIComponent(query)}`;
     const response = await apiClient.get(url);
     return response.data.YOUR_PATH;
   }
   ```

2. **Update `page.tsx`**
   ```typescript
   const handleSearch = async () => {
     await dispatch(searchUsers(searchQuery)).unwrap();
   };
   ```

3. **Test and Verify**
   - Build check
   - API call verification
   - Error handling
   - UI updates

---

## 📋 Quick Examples

### Example 1: Simple GET
```
Endpoint: GET /api/users/search?q={query}
Response: { "data": [users] }

Code:
const response = await apiClient.get(`/users/search?q=${query}`);
return response.data.data;
```

### Example 2: POST with Body
```
Endpoint: POST /api/users/search
Body: { "query": "john" }
Response: { "success": true, "users": [users] }

Code:
const response = await apiClient.post('/users/search', { query });
return response.data.users;
```

### Example 3: GET with Multiple Params
```
Endpoint: GET /api/users?search={query}&type=name,email
Response: [users]

Code:
const response = await apiClient.get(
  `/users?search=${query}&type=name,email`
);
return response.data;
```

---

## 🎯 Ready to Integrate?

**Send me:**
1. ✅ API endpoint URL
2. ✅ Request method and format
3. ✅ Response structure
4. ✅ Any required headers or auth

**I will:**
1. ✅ Update the service
2. ✅ Connect to Redux
3. ✅ Test thoroughly
4. ✅ Confirm working

---

**Current State**: Local filtering works, API integration pending  
**Status**: ⏳ Waiting for API details  
**ETA**: Can integrate in ~10 minutes after receiving API details
