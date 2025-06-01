# Kanban Todo Board

A feature-rich Kanban-style task management application with AI-powered workspace generation. This project includes both frontend and backend components, enabling users to organize tasks, manage projects, and boost productivity.

## Features

- **AI-Powered Workspaces**: Automatically generate structured workspaces and tasks using AI.
- **Kanban and List Views**: Switch between Kanban and List views for task management.
- **Task Prioritization**: Assign priorities to tasks (High, Medium, Low).
- **Due Date Tracking**: Set and track task deadlines.
- **User Authentication**: Secure signup, login, and session management.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Folder Structure

```
kanban-todo-board-assig/
├── frontend/          # React-based frontend application
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── states/        # Recoil state management
│   ├── app/           # Next.js app directory
│   ├── lib/           # Utility functions and API configurations
│   └── public/        # Static assets
├── backend/           # Node.js/Express backend application
│   ├── src/           # Source code
│   │   ├── config/    # Database and environment configuration
│   │   ├── models/    # Mongoose models
│   │   ├── router/    # API routes
│   │   ├── schema/    # Zod schemas for validation
│   │   ├── utils/     # Utility functions
│   │   └── middlewares/ # Express middlewares
│   └── api/           # API entry point
└── readme.md          # Project documentation
```

## Prerequisites

- **Frontend**: Node.js (v16 or higher), npm or yarn
- **Backend**: MongoDB, Node.js (v16 or higher)
- **Environment Variables**: Configure `.env` files in the respective folders (`frontend` and `backend`).

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kanban-todo-board-assig
```

### 2. Configure Environment Variables

Update the `.env` files in the respective folders with the required configuration. Below are the variables you need to set:

#### Backend (`backend/.env`)
- `SECRET_KEY`: Secret key for JWT authentication.
- `MONGOURL`: MongoDB connection string.
- `PORT`: Port number for the backend server.
- `FRONTEND_URL`: URL of the frontend application.
- `GEMINI_API_KEY`: API key for AI-powered workspace generation.

#### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_SERVER_URL`: URL of the backend API.

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 4. Run the Application

#### Start Backend
```bash
cd backend
npm start
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000` (or the port specified in your `.env` file).

## AI-Powered Workspaces

This project leverages AI to create intelligent workspaces with dedicated tasks. Using AI, the application can:
- Automatically categorize tasks based on user prompts.
- Suggest task priorities and deadlines.
- Provide structured task breakdowns for projects.

### Example
When creating a new workspace, the AI can analyze prompts like:
- "Plan a product launch" → Generates tasks such as "Define objectives," "Book venue," etc.

To enable AI features, ensure the following environment variables are configured in `backend/.env`:
- `GEMINI_API_KEY`: API key for the AI service.


## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
