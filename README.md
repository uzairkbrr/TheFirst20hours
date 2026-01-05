# First 20 Hours

**"The only barrier to skill acquisition is emotional, not intellectual."**

**First 20 Hours** is an intelligent web application designed to help you conquer the "frustration barrier" and learn any new skill in just 20 hours of focused, deliberate practice.

Inspired by *Josh Kaufman's* rapid skill acquisition framework, this app combines AI-powered deconstruction, intense focus timers, and gamified progress tracking to turn "I wish I could" into "Look what I can do."

---

## 🚀 Key Features

*   **AI Deconstructor**: Enter any skill (e.g., "Learn Piano"), and the app instantly breaks it down into a concrete, 20-hour learning roadmap.
*   **The 20-Hour Progress Bar**: A tangible, visual tracker that fills up as you practice. Watch yourself move from "Novice" to "Capable."
*   **Deep Focus Timer**: A dedicated practice mode that eliminates distractions. Commit to 45 minutes, no multitasking allowed.
*   **Smart Scheduling**: Life happens. If you miss a day, our "Life Happened" button intelligently reshuffles your schedule so you never feel behind.
*   **Gamification**: Earn badges like "First Step" and "High Five" to keep your dopamine flowing.
*   **Learning Portfolio**: Track your journey. View your completed projects, hours logged, and badges earned in a beautiful portfolio.

---

## 🛠 Tech Stack

**Frontend**
*   **React (Vite)**: Fast, modern UI development.
*   **Tailwind CSS**: Utility-first styling for a sleek, dark-mode aesthetic.
*   **Framer Motion**: Smooth, cinematic animations.
*   **Zustand**: Lightweight global state management.
*   **Lucide React**: Beautiful, consistent iconography.

**Backend**
*   **FastAPI (Python)**: High-performance, async API.
*   **SQLAlchemy + SQLite**: Robust data modeling and persistence.
*   **Pydantic**: Data validation and serialization.

---

## 🏃‍♂️ Quick Start

### Prerequisites
*   Node.js & npm
*   Python 3.8+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to start your journey!

---

## 🧠 The Philosophy

This app is built on 4 major principles:

1.  **Deconstruct**: Break the skill into the smallest possible sub-skills.
2.  **Learn Enough to Correct**: Learn just enough to notice when you're making a mistake, then self-correct.
3.  **Remove Barriers**: Eliminate distractions (phone, TV, etc.) during practice.
4.  **Practice 20 Hours**: Push through the initial frustration barrier.

**Happy Learning!**
