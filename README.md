# Todo App

A modern Next.js todo application with PostgreSQL database and Sequelize ORM.

## Features

- ✅ Create, read, update, and delete tasks
- 📂 Organize tasks by categories
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🗄️ PostgreSQL database with Sequelize ORM
- 📱 Responsive design
- 🌙 Dark/Light theme support

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (version 17 recommended)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the root directory with the following content:

```env
# Database configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=todo_db
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432

# Next.js configuration
NODE_ENV=development
```

**Note:** Replace `your_password_here` with your actual PostgreSQL password. If you haven't set a password, leave it empty.

### 3. Create the database
```bash
createdb todo_db
```

### 4. Run database migrations
```bash
npm run db:migrate
```

### 5. Seed initial categories (optional)
```bash
npm run db:seed:categories
```

### 6. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db:migrate` - Run database migrations
- `npm run db:seed:categories` - Seed initial categories
- `npm run test:db` - Test database connection

## Project Structure

```
test-project-todo/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/             # API routes
│   │   ├── categories/      # Categories page
│   │   └── page.js          # Home page
│   ├── components/          # React components
│   │   ├── todo/            # Todo-specific components
│   │   └── ui/              # Reusable UI components
│   └── lib/                 # Utility functions and configurations
├── models/                  # Sequelize models
├── migrations/              # Database migrations
├── config/                  # Database configuration
└── public/                  # Static assets
```

## Database Schema

### Categories
- `id` - Primary key
- `name` - Category name (unique)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Tasks
- `id` - Primary key
- `title` - Task title
- `description` - Task description
- `completed` - Completion status
- `priority` - Task priority (low, medium, high)
- `categoryId` - Foreign key to categories
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Troubleshooting

### Database Connection Issues
1. Make sure PostgreSQL is running
2. Verify your database credentials in `.env`
3. Ensure the database `todo_db` exists
4. Check if the port 5432 is available

### Migration Issues
If you encounter migration errors:
```bash
# Drop and recreate the database
dropdb todo_db
createdb todo_db
npm run db:migrate
```

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
```

## License

This project is open source and available under the [MIT License](LICENSE).
