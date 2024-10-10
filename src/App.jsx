
import './App.css'
import { useState} from "react"
import OpenAI from "openai";

function App() {
  const [query,setQuery] = useState("")
  const[noOfQuestions,setNoOfQuestions] = useState(4)
  const[difficulty,setDifficulty] = useState("")

  const handleQuery = (e) => {
    setQuery(e.target.value)
  }

  const handleQuestions = (e) => {
    setNoOfQuestions(e.target.value)
  }

  const handleDifficulty = (e) => {
    setDifficulty(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(query)
    console.log(noOfQuestions)
    console.log(difficulty)
  }
  return (
    
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
       
        <button onClick={handleSubmit}>Generate Questions</button>

        </div>
        
      </div>
    
  )
}

export default App
