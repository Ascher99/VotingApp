import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.POSTGRES_DB,
});

// Initialize database
pool.query(`
  CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    animal VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

app.get('/api/votes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        animal,
        COUNT(*) as count
      FROM votes
      GROUP BY animal
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vote', async (req, res) => {
  const { animal } = req.body;
  if (!['cat', 'dog'].includes(animal)) {
    return res.status(400).json({ error: 'Invalid animal' });
  }
  
  try {
    await pool.query('INSERT INTO votes (animal) VALUES ($1)', [animal]);
    res.json({ message: 'Vote recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});