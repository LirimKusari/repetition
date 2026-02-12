# WSR - Weighted Spaced Reinforcement

A flashcard application implementing the Weighted Spaced Reinforcement (WSR) algorithm - a probability-driven variation of the Leitner System designed for rapid and continuous learning.

## Features

- **Continuous Learning**: No fixed review sessions - questions flow continuously
- **Adaptive Difficulty**: Weight-based selection prioritizes cards you struggle with
- **Self-Grading**: After answering, compare your answer with the correct one and self-assess
- **Group Organization**: Organize cards into topic groups
- **Progress Tracking**: Visual statistics showing card distribution across boxes

## Tech Stack

### Backend
- Go with Gin Gonic (web framework)
- PostgreSQL with pgx driver
- UUID-based card/group identification

### Frontend
- React 19 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- TanStack Query (data fetching)
- Zustand (state management)
- React Router (navigation)

## Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL 15+ (installed locally)

## Setup

### 1. Database Setup (Local PostgreSQL)

#### Install PostgreSQL on Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Keep the default port (5432)

#### Create the Database

Open **pgAdmin** (installed with PostgreSQL) or use **psql** command line:

**Using psql:**
```powershell
# Open PowerShell and connect to PostgreSQL
psql -U postgres

# Enter your postgres password when prompted, then run:
CREATE USER wsr WITH PASSWORD 'wsr';
CREATE DATABASE wsr_db OWNER wsr;
GRANT ALL PRIVILEGES ON DATABASE wsr_db TO wsr;
\q
```

**Using pgAdmin:**
1. Open pgAdmin and connect to your local server
2. Right-click "Login/Group Roles" → Create → Login/Group Role
   - Name: `wsr`
   - Password tab: `wsr`
   - Privileges tab: Enable "Can login"
3. Right-click "Databases" → Create → Database
   - Name: `wsr_db`
   - Owner: `wsr`

#### Update Connection String (if needed)

If you used different credentials, update `backend/.env`:

```
DATABASE_URL=postgres://postgres:root@localhost:5432/wsr_db?sslmode=disable
```

### 2. Backend Setup

```bash
cd backend

# Copy environment file and configure
cp .env.example .env

# Edit .env if needed (default connects to Docker PostgreSQL above)

# Run the server
go run main.go
```

The backend will start on `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Usage

1. **Create Groups** (optional): Organize your cards by topic
2. **Add Cards**: Create flashcards with questions and answers
3. **Study**: Start a study session - the WSR algorithm selects cards based on weight
4. **Self-Grade**: After submitting your answer, compare it with the correct answer and mark yourself as correct or incorrect
5. **Track Progress**: View your statistics on the dashboard

## WSR Algorithm

The Weighted Spaced Reinforcement algorithm works as follows:

| Box | Weight | Description |
|-----|--------|-------------|
| 1 | 1.0 | New or incorrect items |
| 2 | 0.5 | Recently learned |
| 3 | 0.25 | Developing recall |
| 4 | 0.1 | Retained knowledge |
| 5 | 0.05 | Nearly mastered |
| 6+ | 0.01 | Long-term memory |

- **Correct answer**: Weight decays by 50%, card moves up one box
- **Wrong answer**: Weight resets to 1.0, card returns to Box 1

Cards are selected probabilistically based on their weights, ensuring difficult cards appear more frequently while mastered cards appear rarely.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cards` | List all cards |
| POST | `/api/cards` | Create a card |
| PUT | `/api/cards/:id` | Update a card |
| DELETE | `/api/cards/:id` | Delete a card |
| GET | `/api/groups` | List all groups |
| POST | `/api/groups` | Create a group |
| PUT | `/api/groups/:id` | Update a group |
| DELETE | `/api/groups/:id` | Delete a group |
| GET | `/api/study/next` | Get next card (WSR selection) |
| POST | `/api/study/answer` | Submit answer result |
| GET | `/api/study/stats` | Get study statistics |

## License

MIT
