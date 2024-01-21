import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to import the CSS file

const questions = [
  "What’s your preferred method of transportation and how often do you use it?",
  "How many times do you travel by airplane per year?",
  "Do you compost?",
  "How often do you recycle?",
  "What is your diet?"
];

const transportationModes = [
  "Combustion Engine Vehicle",
  "Electric Powered Car",
  "Public Transport",
  "Bicycle"
];

const numAirplane = [
  "0",
  "1",
  "2",
  "3",
  "4 or more"
]

const radioCompost = [
  "Yes",
  "No"
]

const radioDiet = [
  "Vegan",
  "Vegeterian",
  "Other diet"
]

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentTransportMode, setCurrentTransportMode] = useState('');
  const [currentSliderValue, setCurrentSliderValue] = useState('0.5');
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const storedAnswers = localStorage.getItem('answers');
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
  }, [answers]);

  const handleNext = () => {
    let answer;
  
    if (currentQuestionIndex === 0) {
      answer = `${currentTransportMode}, ${currentSliderValue}`;
    } else if (currentQuestionIndex === 3) {
      answer = currentSliderValue;
    } else {
      answer = currentTextInput;
    }
  
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentTextInput('');
      setCurrentSliderValue('0.5'); // Reset slider for the next use if needed
    } else {
      console.log(updatedAnswers);
    }
  };

  const handleTextInputChange = (e) => {
    setCurrentTextInput(e.target.value);
  };

  const handleTransportChange = (e) => {
    setCurrentTransportMode(e.target.value);
  };

  const handleSliderChange = (e) => {
    setCurrentSliderValue(e.target.value);
  };

  return (
    <div className="App">
      <h1>{questions[currentQuestionIndex]}</h1>
      {currentQuestionIndex === 0 ? (
        <div>
          <div className="radio-group">
            {transportationModes.map((mode, index) => (
              <label key={index}>
                <input
                  type="radio"
                  value={mode}
                  checked={currentTransportMode === mode}
                  onChange={handleTransportChange}
                />
                {mode}
              </label>
            ))}
          </div>
          <div className="slider-container">
            <div className="labels">
              <span>Rarely</span>
              <span>Moderate</span>
              <span>Often</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentSliderValue}
              onChange={handleSliderChange}
            />
          </div>
        </div>
      ) : currentQuestionIndex === 1 ? (
        <div className="radio-group">
          {numAirplane.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                value={option}
                checked={currentTextInput === option}
                onChange={handleTextInputChange}
              />
              {option}
            </label>
          ))}
        </div>
      ) : currentQuestionIndex === 2 ? (
        <div className="radio-group">
          {radioCompost.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                value={option}
                checked={currentTextInput === option}
                onChange={handleTextInputChange}
              />
              {option}
            </label>
          ))}
        </div>
      ) : currentQuestionIndex === 3 ? (
        <div className="slider-container">
          <div className="labels">
            <span>Rarely</span>
            <span>Moderate</span>
            <span>Often</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={currentSliderValue}
            onChange={handleSliderChange}
          />
        </div>
      ) : currentQuestionIndex === 4 ? (
        <div className="radio-group">
          {radioDiet.map((option, index) => (
            <label key={index}>
            <input
              type="radio"
              value={option}
              checked={currentTextInput === option}
              onChange={handleTextInputChange}
            />
            {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          type="text"
          value={currentTextInput}
          onChange={handleTextInputChange}
        />
      )}
      <button onClick={handleNext}>Next</button>
    </div>
  );
}

export default App;
