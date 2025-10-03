Next.js CRUD Users (MongoDB + Tailwind)

Full stack Next.js 14 CRUD application for managing users. This project demonstrates modern practices in frontend and backend integration, using MongoDB as the database and Tailwind CSS for responsive styling.
	•	Backend: API Route Handlers under /app/api/users
	•	Database: MongoDB with Mongoose
	•	Frontend: Next.js with Tailwind CSS
	•	Features: Create, Read, Update, and Delete users (name, email, role), with validation and error handling

⸻

Features
	•	Add new users with form validation and duplicate email checks
	•	View users in a responsive, paginated table
	•	Search and filter users by role (Admin/User)
	•	Sort by name, email, or role
	•	Edit user details with inline validation
	•	Delete users with confirmation modal
	•	Toast notifications for success and error states
	•	Avatar initials, role badges, and email copy functionality

⸻

Quickstart

# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Run development server
npm run dev
# Open http://localhost:3000

⸻

Scripts
	•	npm run dev – Start development server
	•	npm run build – Build for production
	•	npm run start – Run production build
	•	npm run lint – Run ESLint checks

⸻

Project Structure

app/
  api/users/route.ts          # GET, POST users
  api/users/[id]/route.ts     # PUT, DELETE users
  layout.tsx                  # Root layout with header/footer
  page.tsx                    # Home page
  globals.css                 # Global styles
components/
  UserForm.tsx                # Add new user form
  UserTable.tsx               # User data table with filters, sort, pagination
  EditUserModal.tsx           # Modal for editing users
  Toast.tsx                   # Toast notifications
lib/
  mongodb.ts                  # Mongoose connection helper
models/
  User.ts                     # Mongoose schema and model


⸻

Data Flow (Frontend ⇄ Backend)
	•	Create: UserForm = POST /api/users = MongoDB
	•	Read: page.tsx fetches GET /api/users (server side, no-store)
	•	Update: EditUserModal = PUT /api/users/:id = re-fetch users
	•	Delete: UserTable action = DELETE /api/users/:id = re-fetch users

Responses are JSON. The frontend uses fetch with error handling and router.refresh() to update UI state.

⸻

Deployment (Vercel)

⸻

Author

Edgar Strozzi
	•	GitHub: EdgarStrozzi
	•	Email: edgar22481@outlook.com
	•	LinkedIn: linkedin.com/in/edgar-strozzi-057948329

⸻
