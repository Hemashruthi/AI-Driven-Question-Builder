
import './App.css'
import { useState } from "react"
import OpenAI from "openai";

function App() {
  const [query,setQuery] = useState("")
  const[noOfQuestions,setNoOfQuestions] = useState(4)
  const[difficulty,setDifficulty] = useState("")
  const[generatedQuestions, setGeneratedQuestions] = useState([])

  const handleQuery = (e) => {
    setQuery(e.target.value)
  };

  const handleQuestions = (e) => {
    setNoOfQuestions(e.target.value)
  };

  const handleDifficulty = (e) => {
    setDifficulty(e.target.value)
  };

  const [isLoading, setIsLoading] = useState(false);

  const createQuestionsWithOpenApi = async () => {
    setIsLoading(true);

    const promptMessage = `Generate ${noOfQuestions}
    ${difficulty} questions with 4 options in an array format 
    on the topic: ${query}.
    
    Each question should be structured in JSON format with the following keys:
    
      - 'question': The text of the question.
      - 'options': An array of 4 options, each option as a string.
      - 'correct_option': The correct option (must match one of the options).
      - 'difficulty': The difficulty level of the question('easy', 'medium', 'hard').

      Output the result as an array of JSON opbjects with the struture 
      described. Don;t put anything else. Only valid Array.

      Example format: 

      [
      {
        "question": "What is the caiptal of France?",
        "options": ["Paris", "London", "Berlin", "Rome"], 
        "correct_option: "Paris",
        "difficulty": "easy"
        }
        ]
        `;

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
        });

        try {
          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "you are a helping assistant",
              },
              {
                role: "user",
                content: promptMessage
              },
            ],
            model: "gpt-3.5-turbo",
        });
        setIsLoading(false);

        const response = chatCompletion.choices[0].message?.content;
        const jsonoutput = JSON.parse(response);
        console.log(jsonoutput);
        setGeneratedQuestions(jsonoutput);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
          setGeneratedQuestions([]);
        }    
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(query)
    console.log(noOfQuestions)
    console.log(difficulty)
    createQuestionsWithOpenApi();
  };

  console.log("Generated Questions", generatedQuestions);
  return (
    <>
      <div className='main-container'>
        <h1>Gen AI App</h1>

        <div className="form-container">
        <label>Enter Query: </label>
        <input type="text" placeholder="Enter you query"
        onChange={handleQuery}/>
        <div className="question-input">
        <label>No of Questions: {noOfQuestions}</label>
        <input type="range"min={1} max={10} 
        onChange={handleQuestions}/>
        </div>
        <div>
      <label>Difficulty: </label>
      <select className="Difficulty-input"
      onChange={handleDifficulty}>
        <option value="easy">Easy</option>
        <option value="med">Medium</option>
        <option value="hard">Hard</option>
      </select>
        </div>
       
        <button type="submit" onClick={handleSubmit}>
        {isLoading ? "Generating...": "Generated Questions"}
        </button>

        </div> 
      </div>

      <div>
        {generatedQuestions?.map(({question, options},i) => {
          return (
            <div key={i} className='question-list'>
              <h4>{question}</h4>
              <ul>
                {options.map((option, idx) => {
                  return (
                    <li key={idx}>
                      {idx + 1}.{option}
                    </li>
                    );
                })}
              </ul>
              </div>
          );
        })}
        </div>
        </>
      );
}

export default App
