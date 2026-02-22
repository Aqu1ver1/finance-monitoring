# Finance Monitoring 💰
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

A modern, high-performance **Progressive Web App (PWA)** for personal finance tracking.
Built with a focus on **Offline-first** experience, accessibility, and instant mobile responsiveness.

[<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/123839d5-4f15-4f3c-81d7-cd33bdd2940e" />](https://github.com/Aqu1ver1/finance-monitoring/issues/2#issue-3974456837)

## 🌍 Live Demo
- **Production (Vercel):** [finance-monitoring.vercel.app](https://finance-monitoring.vercel.app)
- **Mirror (GitHub Pages):** [aqu1ver1.github.io/finance-monitoring](https://aqu1ver1.github.io/finance-monitoring/)

---

## ✨ Key Features

### 📱 Mobile-First & PWA
- **Installable:** Functions as a native app on iOS/Android via "Add to Home Screen".
- **Offline Capable:** Works seamlessly without internet connection (Local Storage + Service Workers).
- **Haptic UX:** Optimized touch targets and layout for smartphones.

### 💸 Finance Management
- **Smart Tracking:** Income/Expense logging with custom categories.
- **Data Visualization:** Interactive charts utilizing **Recharts** for financial insights.
- **Budgeting:** Set limits and track progress visually.
- **Multi-currency:** Real-time currency switching support.

### 🤖 AI Financial Advisor
- **GPT-Powered Advice:** Get personalized financial insights based on your real transaction history.
- **4 Focus Modes:** Choose between Overview, Savings Plan, Expense Cuts, or Budget Controls.
- **Bilingual AI:** Advice is delivered in the interface language (English or Russian).
- **Secure by Design:** OpenAI API key is never exposed to the client — all requests are proxied through a dedicated backend service deployed on Render.

### 🎨 UI/UX
- **Dark/Light Mode:** System-aware theme switching.
- **Bilingual:** Full support for English and Russian interfaces.
- **Accessible UI:** Powered by **Headless UI** for keyboard navigation and screen reader support.

---

## 🛠 Tech Stack & Architecture

This project leverages the latest ecosystem tools to ensure performance and type safety.

| Category | Technology | Why? |
|----------|------------|------|
| **Core** | React 19 + TypeScript | Utilizing latest React hooks and strict type safety. |
| **Build Tool** | Vite | Instant HMR and optimized production builds. |
| **State** | Zustand | Lightweight, predictable global state management without boilerplate. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with the new high-performance engine. |
| **UI Logic** | Headless UI | Unstyled, fully accessible UI components (Modals, Dropdowns). |
| **Utils** | clsx + tailwind-merge | Dynamic class composition for clean component architecture. |
| **Charts** | Recharts | Composable charting library built on SVG components. |
| **Icons** | Lucide React | Consistent, lightweight SVG icons. |
| **AI** | OpenAI GPT-4o-mini | Fast and cost-efficient model for financial advice generation. |
| **Backend** | Node.js + Express | Lightweight API server to securely proxy OpenAI requests. |

---

## 🚀 Getting Started

To run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aqu1ver1/finance-monitoring.git
   cd finance-monitoring
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment**

   Create a `.env.local` file in the root:
   ```env
   VITE_API_URL=https://fin-mon-back.onrender.com
   ```
   > For local development with the backend running locally, use `VITE_API_URL=http://localhost:3000`

4. **Run development server**
   ```bash
   npm run dev
   ```

---

### 💡 Architecture Decisions

- **AI via Backend Proxy:** The OpenAI API key is stored exclusively on the backend (Render), never bundled into the frontend. The frontend sends transaction data to the Express server, which calls OpenAI and returns the result — keeping secrets safe.
- **Client-Side Storage:** User financial data persists in `localStorage` for full privacy — no user data is ever sent to a database.
- **Zustand over Redux:** Chosen for its minimalistic API and smaller bundle size, perfect for this scale of application.
- **Tailwind v4:** Adopted to leverage the new Oxy engine for faster compilation.

---

### 👤 Author

**Maksym Hopaitsa**
- Frontend Developer (React / TypeScript)
- [GitHub Profile](https://github.com/Aqu1ver1)
