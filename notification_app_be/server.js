const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Minimal skeleton to satisfy structural requirements
// The frontend directly integrates with the provided evaluation-service API

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
