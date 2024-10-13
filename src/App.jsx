import './App.css';
import { useState } from "react";
import OpenAI from "openai";

function App() {
  const [query, setQuery] = useState("");
  const [noOfQuestions, setNoOfQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Medium");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleQuestions = (e) => {
    setNoOfQuestions(e.target.value);
  };

  const handleDifficulty = (e) => {
    setDifficulty(e.target.value);
  };

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // const createQuestionsWithOpenApi = async () => {
  //   setIsLoading(true);
  //   let retries = 3;  // Number of retries in case of 429 error
  //   let retryDelay = 1000; // Initial delay in milliseconds (1 second)

  //   const promptMessage = `Generate ${noOfQuestions}
  //   ${difficulty} questions with 4 options in an array format 
  //   on the topic: ${query}.
    
  //   Each question should be structured in JSON format with the following keys:
    
  //     - 'question': The text of the question.
  //     - 'options': An array of 4 options, each option as a string.
  //     - 'correct_option': The correct option (must match one of the options).
  //     - 'difficulty': The difficulty level of the question('easy', 'medium', 'hard').

  //     Output the result as an array of JSON objects with the structure 
  //     described. Don't put anything else. Only a valid array.

  //     Example format: 

  //     [
  //       {
  //         "question": "What is the capital of France?",
  //         "options": ["Paris", "London", "Berlin", "Rome"], 
  //         "correct_option": "Paris",
  //         "difficulty": "easy"
  //       }
  //     ]`;

  //   const openai = new OpenAI({
  //     apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //     dangerouslyAllowBrowser: true,
  //   });


  //   while (retries > 0) {
  //     try {
  //       const chatCompletion = await openai.chat.completions.create({
  //         messages: [
  //           { 
  //             role: "system", 
  //             content: "You are a helpful assistant." 
  //           },
  //           { 
  //             role: "user", 
  //             content: promptMessage 
  //           }
  //         ],
  //         model: "gpt-3.5-turbo"
  //       });

  //       setIsLoading(false);
  //       const response = chatCompletion.choices[0].message?.content;
  //       const jsonOutput = JSON.parse(response);
  //       setGeneratedQuestions(jsonOutput);
  //       return;  // If successful, return and stop retrying
  //     } catch (error) {
  //       if (error.status === 429) {  // Rate limit error
  //         console.log("Rate limit exceeded, retrying...");
  //         retries -= 1;
  //         await delay(retryDelay);
  //         retryDelay *= 2;  // Exponential backoff
  //       } else {
  //         console.error(error);
  //         setIsLoading(false);
  //         setGeneratedQuestions([]);
  //         return;  // Stop on other errors
  //       }
  //     }
  //   }

  //   console.log("Retries exhausted. Could not generate questions.");
  //   setIsLoading(false);
  // };


  const createQuestionsWithGeminiApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gemini-1",
          prompt: `Generate ${noOfQuestions} ${difficulty} questions on the topic: ${query}. 
          Each question should have 4 options and specify the correct option.`,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      setGeneratedQuestions(data.questions); // Adjust based on actual response structure
    } catch (error) {
      console.error(error);
      setGeneratedQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    createQuestionsWithGeminiApi();
  };

  return (
    <>
    <div className="main-container">
      <h1>Gen AI App</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <label>Enter Query: </label>
          <input
            type="text"
            placeholder="Enter your query"
            onChange={handleQuery}
            required
          />
  
          <div className="question-input">
            <label>No of Questions: {noOfQuestions}</label>
            <input type="range" min={1} max={10} onChange={handleQuestions} />
          </div>
  
          <div>
            <label className="difficulty-input">Difficulty: </label>
            <select onChange={handleDifficulty}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
  
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </div>
      </form>
  
      <div>
        {generatedQuestions?.length > 0 ? (
          generatedQuestions.map(({ question, options }, i) => (
            <div key={i} className="question-list">
              <h4>{question}</h4>
              <ul>
                {options.map((option, idx) => (
                  <li key={idx}>
                    {idx + 1}. {option}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No questions generated yet.</p>
        )}
      </div>
    </div>
  </>
  
  );
}

export default App;
