# 🪵 Hearth Finance Tracker

A premium personal finance web application featuring a high-performance **FastAPI** backend and a modern, lightweight **Vanilla JavaScript** single-page frontend. 

Built with a modern UI design system supporting dynamic **Dark/Light themes** and real-time financial analytics dashboard—all strictly isolated per authenticated user.

---

## ✨ Key Features

* **Dynamic Dashboard:** Real-time financial summary aggregation with interactive Chart.js analytics.
* **Modern UI/UX:** Premium layout utilizing modern design tokens and seamless dark mode toggling.
* **Complete Financial Suite:** Full CRUD operations for accounts, transactions, budgets, subscriptions, and bill tracking.
* **Smart Savings Wizard:** Goal-oriented tracking system with an integrated micro-savings contribution feature.
* **Secure Session Architecture:** Robust JWT-based authentication system with centralized frontend state management (`STORE`).

---

## 🛠️ Tech Stack

* **Backend:** FastAPI, Uvicorn, SQLAlchemy 2 (ORM), SQLite, Pydantic v2, Python-Jose (JWT), Passlib (Bcrypt).
* **Frontend:** Vanilla HTML5, CSS3 (Custom Properties / Design Tokens), Modern JavaScript (ES6+), Chart.js via CDN.

---

## 📂 Project Structure


```

Hearth-Finance-Tracker/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py          # JWT authentication dependency
│   │   │   ├── router.py        # Master route aggregator
│   │   │   └── routes/
│   │   │       ├── auth.py          # Registration, login, and user session
│   │   │       ├── accounts.py      # Bank accounts ledger management
│   │   │       ├── transactions.py  # User transactions logging
│   │   │       ├── budgets.py       # Budget caps and tracking
│   │   │       ├── goals.py         # Savings goals and milestones
│   │   │       ├── subscriptions.py # Recurring subscriptions ledger
│   │   │       ├── bills.py         # Bill alerts and schedule management
│   │   │       └── dashboard.py     # High-speed data aggregator
│   │   ├── core/
│   │   │   ├── config.py        # Settings management via Pydantic
│   │   │   └── security.py      # Passwords hashing and JWT tokens handling
│   │   ├── db/
│   │   │   └── session.py       # SQLAlchemy engine configuration
│   │   ├── models/              # Relational database models
│   │   ├── schemas/             # Request/Response validation schemas
│   │   ├── main.py              # Application entry point & CORS configuration
│   │   └── seed.py              # Demo database seeder script
│   ├── .env.example             # Template for local environment variables
│   └── requirements.txt         # Backend Python dependencies
└── frontend/
├── index.html               # Main application template
├── css/
│   ├── base.css, tokens.css # Reset + design tokens (Dark & Light modes)
│   ├── components.css       # Typography, buttons, inputs, badges, cards
│   ├── app-shell.css        # Sidebar, main area, topbar
│   ├── pages/               # landing, auth, dashboard, transactions, budget, savings, analytics, reports, calendar, subscriptions, settings
│   └── modals.css, toasts.css, states.css, boot-loader.css, animations.css, responsive.css
└── js/
├── config.js            # Global network environment configs
├── api.js               # Reactive fetch wrapper (injects Bearer tokens)
├── store.js             # Client-side global reactive state manager
├── auth.js              # Authentication token workflows
├── app.js               # Client-side SPA routing and UI refreshing
├── modals.js            # Extensible modal shell and dynamic forms engine
└── pages/               # Functional view controllers
├── landing.js       │── dashboard.js     │── budget.js
├── auth-page.js     │── transactions.js  │── savings.js
├── analytics.js     │── subscriptions.js │── settings.js
└── reports.js       │── calendar.js      │── profile.js

```

---

## 🚀 Getting Started

### 1. Backend Installation

> **Note:** Requires Python 3.10+ installed.

```bash
cd backend

# Setup environment variables
cp .env.example .env

# Initialize virtual environment and install packages
python -m venv .venv
source .venv/bin/activate        # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt

# Seed the demo user profiles
python -m app.seed

# Launch local development server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

```

* **API Base URL:** `http://127.0.0.1:8000`
* **Interactive OpenAPI Docs:** `http://127.0.0.1:8000/docs`

### 2. Frontend Launch

The frontend is absolute plain vanilla web primitives—**no bundlers or heavy node_modules needed.**

Run it using any lightweight static web server:

```bash
cd frontend
python -m http.server 5500 --bind 127.0.0.1

```

Now, navigate to `http://127.0.0.1:5500/index.html` in your browser.

---

## 🔒 Configuration & Authentication

### Environment Keys

| Variable | Default Value | Description |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./hearth.db` | Target SQLite local file pathway. |
| `SECRET_KEY` | — | Cryptographic key for JWT security hashing. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` (7 Days) | Token session duration window. |
| `ALGORITHM` | `HS256` | Secure algorithm for session payloads. |
| `CORS_ORIGINS` | Local host ports | Whitelisted client connection addresses. |

### Demo Profile Credentials

Run `python -m app.seed` to instantly spin up a sandbox environment filled with dummy data:

* **Email:** `demo@hearth.app`
* **Password:** `password123`

---

## 🔌 API Documentation Matrix

All data endpoints require a valid `Authorization: Bearer <JWT>` header.

| Method | Endpoint | Action |
| --- | --- | --- |
| `GET` | `/api/health` | Service availability check |
| `POST` | `/api/auth/register` | Register new user profile |
| `POST` | `/api/auth/login` | Exchange credentials for JWT |
| `GET/PATCH` | `/api/auth/me` | Fetch / Update user profile telemetry |
| `GET/POST` | `/api/accounts` | Fetch and create user bank accounts |
| `PATCH/DELETE` | `/api/accounts/{id}` | Update or delete existing accounts |
| `GET/POST` | `/api/transactions` | Query or post structural transaction entries |
| `PATCH/DELETE` | `/api/transactions/{id}` | Update or delete transaction history rows |
| `GET/POST` | `/api/budgets` | Fetch or establish threshold budget categories |
| `GET/POST` | `/api/goals` | View or create target savings goals |
| `POST` | `/api/goals/{id}/contribute` | Process a micro-saving injection toward a goal |
| `GET/POST` | `/api/subscriptions` | Fetch and track active recurring subscriptions |
| `GET/POST` | `/api/bills` | View and track fixed-date liability items |
| `GET` | `/api/dashboard/summary` | Aggregate full telemetry summary for dashboard graphs |

```