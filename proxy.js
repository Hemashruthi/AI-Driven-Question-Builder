import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Make sure to install node-fetch

const app = express();


// Middleware to handle JSON requests
app.use(express.json());
app.use(cors());

// Your route to generate questions
app.post('/api/generate-questions', (req, res) => {
  const { model, prompt } = req.body;
  console.log('Received request:', model, prompt);
  
  // Simulate the generation of questions
  const generatedQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Rome"],
      correct_option: "Paris",
      difficulty: "medium"
    }
  ];

  res.json({ questions: generatedQuestions });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});