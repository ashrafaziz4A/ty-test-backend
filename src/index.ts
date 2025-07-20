import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config(); // Load .env file

const app = express();
app.use(cors());
// Get host and port from .env or fallback defaults
const PORT = parseInt(process.env.PORT || '3000');
const HOST = process.env.HOST || '127.0.0.1';

// Utility functions
const generateDeck = (): string[] => {
  const suits = ['S', 'H', 'D', 'C'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'X', 'J', 'Q', 'K'];
  return suits.flatMap(suit => values.map(value => `${value}${suit}`));
};

const shuffle = (deck: string[]): string[] =>
  deck.map(card => ({ card, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(obj => obj.card);

// Routes
app.get('/distribute', (req, res) => {
  const n = parseInt(req.query.n as string);

  if (!n || isNaN(n) || n <= 0) {
    return res.status(400).json({
      error: 'Input value does not exist or value is invalid.',
    });
  }

  const deck = shuffle(generateDeck());
  const distribution: Record<string, string[]> = {};

  for (let i = 0; i < n; i++) {
    distribution[`Person_${i + 1}`] = [];
  }

  deck.forEach((card, index) => {
    distribution[`Person_${(index % n) + 1}`].push(card);
  });

  res.json(distribution);
});

app.get('/', (_req, res) => {
  res.send('Use /distribute?n=number to distribute cards');
});

// Start server using env config
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
