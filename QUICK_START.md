# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Start the Development Server
```bash
npm run dev
```

### 2️⃣ Open Your Browser & Login
Navigate to:
```
http://localhost:3000
```

**Login with these credentials:**
```
Email: admin@gmail.com
Password: Admin@123
```

### 3️⃣ Explore the Dashboard
- ✅ View all users in the table
- ✅ Click "View Details" to see full user info
- ✅ Use "Refresh" button to reload data
- ✅ Toggle dark/light mode
- ✅ Click "Logout" to sign out

---

## 🔐 Authentication

The dashboard is now **protected with login**.

**Demo Credentials:**
- Email: `admin@gmail.com`
- Password: `Admin@123`

⚠️ These are temporary credentials for development. See [AUTH_GUIDE.md](./AUTH_GUIDE.md) for production setup.

---

## 📍 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page (redirects to login) |
| `/login` | Public | **Admin login page** |
| `/dashboard` | Protected | **Main admin dashboard** (requires login) |

---

## 🎯 What You Can Do

### ✅ View All Users
The dashboard automatically fetches and displays all users from the API when you load the page.

### ✅ View User Details
Click the "View Details" button on any user row to see:
- User ID
- Full name
- Email address
- Phone number
- Creation date
- Last update date

### ✅ Refresh Data
Click the "Refresh" button in the header to reload all users from the API.

### ✅ Switch Themes
Use the theme toggle in the header to switch between light and dark modes.

---

## 🔌 API Endpoints

The dashboard connects to:
```
https://mobulous-tech.vercel.app/api
```

**Endpoints:**
- `GET /users` - Fetch all users
- `GET /users/:_id` - Fetch user by ID

---

## 🏗️ Project Structure

```
asset-heaven-admin-fe/
├── app/
│   └── dashboard/
│       └── page.tsx              # 👈 Main dashboard page
│
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx   # Header component
│       ├── UserTable.tsx         # User table component
│       └── UserDetailsModal.tsx  # Details modal component
│
├── features/
│   └── users/
│       └── usersSlice.ts         # Redux state management
│
├── services/
│   └── api/
│       ├── userService.ts        # API service
│       └── config.ts             # API configuration
│
└── types/
    └── user.types.ts             # TypeScript types
```

---

## 🐛 Troubleshooting

### Dashboard not loading?
**Check if the dev server is running:**
```bash
npm run dev
```

### Can't see users?
**Check your internet connection** - The dashboard fetches data from an external API.

### TypeScript errors?
**Restart your IDE** to refresh TypeScript paths.

### Build errors?
**Reinstall dependencies:**
```bash
npm install
```

---

## 📚 Need More Help?

Check these detailed guides:
- `README_DASHBOARD.md` - Dashboard overview
- `DASHBOARD_GUIDE.md` - Complete implementation guide
- `IMPLEMENTATION_SUMMARY.md` - Architecture and features

---

## 🎉 That's It!

You're ready to use your admin dashboard. Happy managing! 🚀
