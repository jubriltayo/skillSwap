# SkillSwap

**SkillSwap** is a scalable skill exchange platform that connects users seeking or offering skills for collaboration. Built with a modern stack—**Laravel (PHP)** for the backend and **React 19 + Tailwind CSS 4** for the frontend—SkillSwap enables seamless, user-driven connections through posts and direct interactions.

---

## 🔥 Live Demo

- **Frontend**: [https://skill-swap-alpha-neon.vercel.app/](https://skill-swap-alpha-neon.vercel.app/)
- **Backend**: [https://skillswap-gsey.onrender.com](https://skillswap-gsey.onrender.com)

---

## 🧠 User Story

As a user, I want to:
- Sign up and view posts made by other users.
- Create a post where I can either offer a service or seek help, explaining both what I need and what I can offer in return.
- Receive connection requests from other users who are interested in my post.
- Evaluate offers and accept or reject based on the skill match or my preferences.
- Once connected, exchange email addresses to collaborate further.

---

## ✨ Features

- 🔐 **Authentication**: Secure signup and login functionality
- 📝 **CRUD Posts**: Create, read, update, and delete posts
- 👤 **Profile Management**: Edit profile and manage user information
- 🔄 **Connection Management**: Accept/reject skill exchange requests and view connection history
- 🔍 **Search & Pagination**: Easily navigate and filter posts
- 🚨 **Notifications**: Pop-up alerts for actions and status changes
- ✅ **User & Post Policies**: Role-based access, ownership checks, and constraints

---

## ⚙️ Tech Stack

### Frontend
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- Deployed on **Vercel**

### Backend
- [Laravel (PHP)](https://laravel.com/)
- [PostgreSQL](https://www.postgresql.org/)
- Dockerized and deployed on **Render**

---

## 📦 Installation (Development Setup)

### Backend
```bash
git clone https://github.com/jubriltayo/skillswap-backend.git
cd skillswap-backend
cp .env.example .env
docker-compose up --build
````

### Frontend

```bash
git clone https://github.com/jubriltayo/skillswap-frontend.git
cd skillswap-frontend
npm install
npm run dev
```

---

## 🙋🏽 About the Author

This project is a solo build by **Tayo Jubril**, a passionate full-stack developer (backend heavy).

* 🔗 [LinkedIn](https://www.linkedin.com/in/jubril-tayo)
* 🐙 [GitHub](https://github.com/jubriltayo)
