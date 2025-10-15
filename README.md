# SkillSwap — Fullstack Collaboration Platform

SkillSwap is a fullstack web application that connects users based on skills they offer or seek. It enables users to create posts, send connection requests, and exchange messages — all built with a modern Laravel + Next.js stack.

---

## 🧱 Tech Stack

- **Backend**: Laravel 12.9, Sanctum, PostgreSQL
- **Frontend**: Next.js 15+, TypeScript, React Context, Tailwind CSS
- **Auth**: Token-based authentication via Laravel Sanctum
- **State Management**: React Context + Custom Hooks

---

## 🚀 Features

- User registration and login
- Skill-based post creation and filtering
- Connection requests (send, accept, reject, cancel)
- Messaging between connected users
- Dashboard stats and user search
- Responsive UI with reusable components

---

## 📦 Project Structure

```
skillSwap/
├── backend/       # Laravel API
├── frontend/      # Next.js app
```

---

## 🔐 Authentication Flow

- Users log in via `/login` and receive a token
- Token stored in `localStorage` and sent with `Authorization: Bearer <token>`
- Laravel Sanctum validates and manages sessions
- Frontend uses `AuthContext` to manage login/logout and current user

---

## 🔗 Connection Flow

- Users send requests to posts
- Requests can be accepted, rejected, or canceled
- Connection status and counts are tracked globally via `ConnectionsContext`

---

## 💬 Messaging Flow

- Connected users can exchange messages
- Messages are scoped by `connectionId`
- `MessagesContext` manages message state per connection

---

## 🛠 Setup Instructions

### Backend (Laravel)
```bash
cd backend
composer install
php artisan migrate
php artisan serve
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Environment Variables

### Backend `.env`
```
APP_URL=http://localhost:8000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### Frontend `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 🧠 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

