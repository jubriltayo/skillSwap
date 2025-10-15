
# SkillSwap Frontend — Next.js + TypeScript

This is the frontend for SkillSwap, a skill-based collaboration platform. It’s built with Next.js 15+, TypeScript, and React Context for global state management.

---

## 🧱 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS
- **Routing**: File-based routing via `app/`

---

## 📦 Folder Structure

```
frontend/
├── app/              # Route-level pages and layouts
│   ├── (auth)/       # Login and registration
│   ├── connections/  # Connections dashboard
│   ├── messages/     # Messaging interface
│   ├── posts/        # Post listing, creation, editing
│   ├── profile/      # User profile views
│   ├── users/        # User discovery
│   ├── layout.tsx    # Global layout wrapper
│   └── page.tsx      # Home page
├── components/       # Reusable UI and feature components
│   ├── auth/         # Protected route wrapper
│   ├── connections/  # Connection tabs, dialogs, lists
│   ├── layout/       # Header, footer, app shell
│   ├── loading/      # Enhanced loading indicators
│   ├── main/         # Home page sections
│   ├── messages/     # Message list and content
│   ├── posts/        # Post card, form, filters
│   ├── profile/      # Avatar, tabs, skill manager
│   ├── theme/        # Theme toggle and provider
│   ├── ui/           # Generic UI components (button, card, input, etc.)
│   └── users/        # User card component
├── lib/              # Logic layer
│   ├── api/          # API client wrapper
│   ├── contexts/     # Auth, Connections, Messages providers
│   ├── hooks/        # Custom hooks for posts and users
│   ├── services/     # Business logic for API calls
│   ├── types/        # TypeScript interfaces
│   ├── utils/        # Utility functions
├── public/           # Static assets
├── next.config.ts    # Next.js config
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript config
```

---

## 🔐 AuthContext

Manages login, logout, registration, and current user state.

```tsx
const { user, login, logout } = useAuth();
```

---

## 🔗 ConnectionsContext

Tracks all connection-related data and actions.

```tsx
const { connections, sendRequest, acceptRequest } = useConnections();
```

---

## 💬 MessagesContext

Handles message loading and sending per connection.

```tsx
const { messages, sendMessage, loadMessages } = useMessages();
```

---

## 🧠 Custom Hooks

- `useUsers()` → fetch and search users
- `usePosts()` → fetch, create, update, delete posts
- `useUserPosts()` → fetch current user’s posts

---

## 🛠 Setup

```bash
cd frontend
npm install
npm run dev
```

Set your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
