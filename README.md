# 🌀 TalentLoop

An advanced, product-first technical talent assessment and career progression engine. **TalentLoop** continuously analyzes an engineer's practical competencies through interactive evaluations and automated ATS resume parsing to map highly structured, personalized 6-month learning roadmaps.

Designed with a high-end developer aesthetic, it serves as a robust tool for engineers aiming to hard-verify their skills and target engineering, business, tech, or health-tech roles.

---

## 🚀 Core Features

- **Interactive Skill Triage**: Allows candidates to manually audit their competencies across structured category domains including Technology, Engineering, Business, and Healthcare.
- **Automated ATS CV Parser**: Real-time PDF binary parsing layer using `pdf.js` that extracts, structures, and synchronizes academic and professional experiences automatically with user profile metrics.
- **Adaptive Evaluation Arena**: Dynamically generates multi-choice verification quizzes calibrated to input skill sets using **Gemini 3.5 Flash**.
- **Challenging Yet Motivating Question Curves**: Quiz logic enforces a balanced cognitive progression path built to encourage and validate talents:
  - **20% Beginner Level** foundational wins to build initial confidence.
  - **30% Intermediate Level** trade-off and implementation scenarios.
  - **50% High-Level Professional** complex architecture patterns and edge-case debugging instances.
- **6-Month Curriculum Roadmaps**: Constructs localized month-by-month progressive tracks blending global learning frameworks (Coursera, freeCodeCamp) with distinct, affordable African training networks (ALX Africa, Jobberman Skills, Utiva).
- **Persistent Progress Tracking**: Hardens completion markers instantly inside an interactive PostgreSQL JSONB checklist engine powered by React Mutation streams.

---

## 🛠️ Architecture & Technical Stack

TalentLoop is built from the ground up as a type-safe, optimized modern frontend application:

### Core Framework & State Management

- **React 19**: Leverages modern hook lifecycle architecture for component declarations.
- **TypeScript**: Implements compile-time data contracts, static prop validations, and safe parameter overrides across all domains.
- **TanStack React Query v5**: Manages declarative asynchronous remote state caching, automated cache invalidations, and background mutation query lifecycles.
- **React Hook Form**: Drives type-safe form validations and constraint auditing across authentication boundaries.

### UI, Theme, & Animation Engineering

- **Tailwind CSS v4**: Compiles high-performance theme design primitives inside a dark-mode-first aesthetic centered on deep indigo backgrounds and vibrant violet accents.
- **Motion (Framer Motion v12)**: Implements spring-based responsive layout shifts, entrance gestures, and smooth mobile sidebar navigation toggles.
- **Lucide React**: Supplies clean, unified functional structural icons.

### Backend Services & Cloud Ingestion

- **Supabase Client**: Interfaces securely with PostgreSQL tables, manages database row insertions, and updates metadata variables.
- **Supabase Auth**: Executes user registration hooks, initializes user session records, and triggers protected password recoveries.
- **Supabase Storage**: Manages live, secure image binary asset storage streaming directly into dedicated bucket paths.
- **Google Gen AI SDK**: Interfaces directly with deep reasoning models via API configuration hooks.

---

## 📂 Repository Directory Maps

```text
src/
├── components/
│   ├── AppLayout.tsx         # Unified page master framework shell wrapper
│   ├── Header.tsx            # Session header tracking user initials and signatures
│   ├── Sidebar.tsx           # Navigation links mapping active feature endpoints
│   ├── ProtectedRoute.tsx    # Strict type-guarded component authorization barrier
│   └── Spinner.tsx           # Performance loading animation system tokens
│
├── features/
│   ├── authentication/       # Account updates, credentials adjustments, and forms
│   ├── career-recommendation/# Gemini counselor tracks and 6-month roadmap tables
│   ├── cv-processing/        # PDF file extractors and ATS summary previews
│   ├── dashboard/            # Workspaces logs history metrics grids
│   └── skill-assessment/     # Skill category matrices and countdown testing clocks
│
├── services/
│   ├── apiAuth.ts            # Type-safe Supabase auth transactions services layer
│   ├── apiRecommendations.ts # Persistent query mapping functions for roadmaps
│   ├── gemini.ts             # Calibrated prompt compilation and SDK config definitions
│   └── supabase.ts           # Client initialization endpoints validation module
│
├── styles/
│   └── index.css             # Tailwind v4 color configurations system stylesheet
├── main.tsx                  # Strict React DOM application bootstrap entry hook
└── routes.tsx                # Data-driven RouteObject collection configuration tree
```

## ⚡ Setup & Development Workflows

Follow these configuration steps to clone the repository, set up your backend credentials, and initialize the local development server.

### 📋 Prerequisites

Before initializing the workspace, ensure you have the following system resources and accounts configured:

- **Node.js**: Version `20.x` or higher recommended.
- **Supabase Account**: A live instance containing initialized tables for `profiles`, `assessments`, and `roadmaps`.
- **Gemini Developer API Key**: A valid secret key generated from Google AI Studio to interface with the `gemini-3.5-flash` model.

### 🔑 Environment Instantiations

TalentLoop relies on strict system variables to establish database handshake loops and generative connections safely.

Create a `.env` configuration file in your root workspace path[cite: 3]:

```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_anon_key
VITE_GEMINI_API_KEY=your_gemini_developer_api_key
```
