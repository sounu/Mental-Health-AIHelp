# Mental-Health-AIHelp

Mental-Health-AIHelp is a full-stack **Next.js** web application that provides AI-assisted mental health support through interactive conversations and structured user sessions.

The goal of this project is to explore how AI can assist users with basic mental wellness guidance, self-reflection, and emotional support in a safe and user-friendly interface.

> ⚠️ This project is for educational purposes only and is **not a replacement for professional mental health care**.

---

## 🚀 Features

- 🤖 AI-powered mental health assistance
- 💬 Interactive chat-based support
- 🧠 Session-based conversation history
- 📱 Responsive UI built with Tailwind CSS
- 🔐 Secure backend APIs

---

## 🛠 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | Next.js (React + TypeScript) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes / Server Actions |
| Database | PostgreSQL |
| ORM | Prisma |
| AI | OpenAI / Gemini (configurable) |
| Deployment | Vercel |

---

## 🧠 Database Design (High-Level)

**PostgreSQL tables:**
- `users` – user profiles and authentication data
- `sessions` – mental health chat sessions
- `messages` – user and AI chat messages
- `mood_logs` – optional mood tracking entries

This structure ensures data integrity, easy querying, and future scalability.

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/sounu/Mental-Health-AIHelp.git
cd Mental-Health-AIHelp
