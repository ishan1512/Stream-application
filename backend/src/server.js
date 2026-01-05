import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.route.js';
import { connectDb } from './utils/db.js';

const app = express();
dotenv.config();
app.use(express.json());

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 5001;
app.listen(5001, () => {
  connectDb();
  console.log(`Server is running on port: ${port}`);
});
