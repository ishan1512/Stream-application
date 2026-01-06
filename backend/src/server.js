import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import { connectDb } from './utils/db.js';

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5001;
app.listen(5001, () => {
  connectDb();
  console.log(`Server is running on port: ${port}`);
});
