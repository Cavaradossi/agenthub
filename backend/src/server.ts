import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agenthubRouter from './agenthub';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', agenthubRouter);

app.listen(PORT, () => {
  console.log(`AgentHub backend running on http://localhost:${PORT}`);
});
