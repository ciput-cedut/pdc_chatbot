# Backend Server Setup

This backend server handles file uploads for the PDC Chatbot.

## Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

Start the server:
```bash
npm start
```

Or use nodemon for development (auto-restart on changes):
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Uploaded Files Location

All uploaded files are saved to: `src/uploads/`

## API Endpoints

- **POST** `/api/upload` - Upload files (max 10 files, 50MB each)
- **GET** `/api/files` - Get list of all uploaded files
- **GET** `/api/download/:filename` - Download a specific file
- **DELETE** `/api/files/:filename` - Delete a specific file

## Important

Make sure the backend server is running before uploading files in the chatbot. Otherwise, files will be displayed but not saved to disk.
