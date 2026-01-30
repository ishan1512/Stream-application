import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { connectDb } from './utils/db.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, //this allows frontend to send cookies
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

const port = process.env.PORT || 5001;
app.listen(5001, () => {
  connectDb();
  console.log(`Server is running on port: ${port}`);
});
