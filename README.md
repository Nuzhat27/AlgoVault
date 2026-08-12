# AlgoFlow

AlgoFlow is a full-stack coding interview preparation platform for practicing DSA problems, learning coding patterns, tracking practice, scheduling reviews, and conducting mock interviews.

## Features

- JWT-based authentication
- DSA problem management and practice
- Coding patterns
- Practice and progress tracking
- Review scheduling
- Mock interview sessions
- AI-powered transcript evaluation
- Theme support

## Tech Stack

**Frontend:** React, Vite, React Router, Redux/Redux Toolkit, Axios, Tailwind CSS

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT

## Project Structure

```text
AlgoFlow/
├── client/       # React + Vite frontend
├── server/       # Node.js + Express backend
├── .gitignore
└── README.md
```

## Environment Variables

### Frontend

Create `.env` in the frontend:

```env
VITE_API_URL=http://localhost:5001/api
```

For production, use the deployed Render API:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

### Backend

Create `.env` in the backend:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SEED_EMAIL=your_email@example.com
```

Add any additional AI/API variables required by the backend.

**Never commit `.env` files or secret credentials to GitHub.**

## Run Locally

### Backend

```bash
cd server
npm install
npm run dev
```

Backend:

```text
http://localhost:5001
```

### Frontend

In another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:3001
```

## API Routes

The frontend communicates with the backend through `VITE_API_URL`.

Main API areas:

- `/api/auth`
- `/api/problems`
- `/api/patterns`
- `/api/mock-sessions`
- `/api/evaluate`

JWT authentication is used for protected requests.

## Deployment

AlgoFlow uses:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

For production:

1. Deploy the backend to Render.
2. Add the required backend environment variables in Render.
3. Deploy the frontend to Vercel.
4. Set `VITE_API_URL` in Vercel to the Render backend API URL.
5. Configure backend CORS to allow the Vercel frontend domain.

Example:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

## Security

- Keep `.env` files out of Git.
- Never expose MongoDB credentials or JWT secrets.
- Use strong production secrets.
- Configure CORS for the deployed frontend.
- Store production secrets in Render/Vercel environment variables.

## License

This project is intended for educational and personal use.
