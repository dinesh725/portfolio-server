# Portfolio API (Node.js Backend)

A RESTful API backend for the portfolio website, built with Express.js and MongoDB. Handles project management, CV storage, and contact form submissions.

## Features

- Project CRUD operations with authentication
- File uploads for project images and CV
- Secure admin endpoints with password protection
- MongoDB integration for data persistence
- CORS enabled for frontend access

## Prerequisites

- Node.js 16+ and npm/yarn
- MongoDB Atlas account or local MongoDB instance
- Git

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=4000
   CV_UPLOAD_PASSWORD=your_secure_password
   PROJECT_PASSWORD=your_secure_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get a single project
- `POST /projects` - Create a new project (requires `x-project-password` header)
- `PUT /projects/:id` - Update a project (requires `x-project-password` header)
- `DELETE /projects/:id` - Delete a project (requires `x-project-password` header)

### CV
- `GET /cv` - Download the current CV
- `POST /cv` - Upload a new CV (requires `x-cv-password` header)

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| MONGODB_URI | MongoDB connection string | Yes | - |
| PORT | Server port | No | 4000 |
| CV_UPLOAD_PASSWORD | Password for CV uploads | Yes | - |
| PROJECT_PASSWORD | Password for project management | Yes | - |

## Project Structure

```
server/
├── src/
│   ├── models/       # MongoDB models
│   ├── routes/       # API route handlers
│   │   ├── projects.js
│   │   ├── cv.js
│   │   └── uploads.js
│   └── index.js      # Main application entry point
├── uploads/          # File uploads (not in version control)
├── .env.example      # Example environment variables
├── .gitignore
├── package.json
└── README.md
```

## Deployment

### Recommended: Render/Railway
1. Push your code to a Git repository
2. Create a new web service on Render/Railway
3. Set up the environment variables from your `.env` file
4. Deploy from the Git repository

### Important Notes for Production
- Store uploads in cloud storage (e.g., AWS S3) instead of local filesystem
- Use environment variables for all sensitive data
- Set up proper CORS origins in production
- Consider adding rate limiting and request validation

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## License

MIT
