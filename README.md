# Release Checklist Tool

A modern, full-stack single-page application built to help development teams track their software release process.

## Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS v4, Apollo Client
* **Backend:** Next.js API Routes, Apollo Server (GraphQL), Prisma ORM
* **Database:** PostgreSQL (Hosted on Supabase)
* **Deployment:** Vercel

## Running the Code Locally

### Prerequisites
* Node.js installed on your machine.
* A PostgreSQL database instance (e.g., a free project on Supabase or Neon).

### Setup Instructions

#### 1. Clone the repository and install dependencies
Open your terminal and run:
```powershell
npm install
```

#### 2. Configure your Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
```

#### 3. Initialize the Database
Push the Prisma schema to your live database to create the necessary tables:

```powershell
npx prisma db push
```

#### 4. Start the Development Server
```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Database Schema
The application uses a single main model to store releases. It utilizes PostgreSQL's native JSON support to track the checklist steps efficiently without needing a separate relational table for the steps themselves.

```prisma
model Release {
  id                String   @id @default(uuid())
  versionName       String
  createdAt         DateTime @default(now())
  additionalRemarks String?
  stepsState        Json     
}
```

**Note:** The status (Planned, Ongoing, Done) is not stored directly in the database. It is dynamically computed by the GraphQL resolver based on the completion state of the `stepsState` JSON object.

## API Endpoints (GraphQL)
This application uses a single GraphQL endpoint located at `/api/graphql`.

You can interact with the API using the Apollo Sandbox by navigating to http://localhost:3000/api/graphql in your browser while the development server is running.

### Supported Operations

#### Queries
- **releases**: Fetches a list of all releases, ordered by newest first.
- **release(id: ID!)**: Fetches a singular release and its detailed step state.

#### Mutations
- **createRelease(versionName: String!, additionalRemarks: String)**: Creates a new release with all steps defaulting to false (unchecked).
- **updateSteps(id: ID!, steps: StepsInput!)**: Updates the boolean state of specific checklist items.
- **deleteRelease(id: ID!)**: Removes a specific release from the database.

## Application Views

### Main Dashboard (`/`)
- Displays a list of all releases.
- Shows the computed status of each release.
- Includes a form to create a new release.
- Includes a button to delete a release.

### Release Details (`/release/[id]`)
- Displays the specific checklist for a chosen release.
- Clicking the checkboxes instantly updates the database via GraphQL mutations and dynamically updates the release status without a page reload.
