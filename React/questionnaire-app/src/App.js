import React, { useState, useEffect, memo } from 'react';
import './App.css';
let value1, value2, value3, value4, value5, value6, value7, value8;

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

// Question Component
const Question = memo(({ question, children }) => (
  <div>
    <h1>{question}</h1>
    {children}
  </div>
));

// RadioGroup Component
const RadioGroup = memo(({ options, selectedValue, onChange }) => (
  <div className="radio-group">
    {options.map((option, index) => (
      <label key={index}>
        <input
          type="radio"
          value={option}
          checked={selectedValue === option}
          onChange={onChange}
        />
        {option}
      </label>
    ))}
  </div>
));

// RangeSlider Component
const RangeSlider = memo(({ value, onChange }) => (
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
      value={value}
      onChange={onChange}
    />
  </div>
));

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentTransportMode, setCurrentTransportMode] = useState('');
  const [currentSliderValue, setCurrentSliderValue] = useState('0.5');
  const [currentTextInput, setCurrentTextInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [processedResults, setProcessedResults] = useState(null);
  const [animateLeft, setAnimateLeft] = useState(false);

  useEffect(() => {
    const storedAnswers = localStorage.getItem('answers');
    console.log("once", storedAnswers)
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('answers', JSON.stringify(answers));
    console.log("often", answers)
  }, [answers]);

  const handleSubmit = async (event) => {
    console.log("====================================================")

    event.preventDefault();
    console.log("?????????????????????????????????????????????????????")

    let answer = currentTextInput;
    const updatedAnswers = [...answers, answer];

    // Convert the updatedAnswers array to a JSON string
    const answersJson = JSON.stringify(updatedAnswers);

    // Set the answers state
    setAnswers(updatedAnswers);

    // Set the completed state (assuming you want to set it)
    setCompleted(true);

    // Save the JSON string to local storage
    localStorage.setItem('answers', answersJson);

    try {
      // Send the JSON string to the backend
      const response = await fetch('http://localhost:8000/submit_answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: answersJson })
      });

      if (true) {
        const processedData = await response.json();

        console.log(processedData, "====================================================")

        // Split the output string into an array of values
        const outputValues = processedData.output.split(',');


        // Ensure there are at least 8 values in the array
        if (outputValues.length >= 8) {
          value1 = outputValues[0] //.trim().replace(/['\[\]]/g, '').replace(/\.\.\/React\/questionnaire-app\/public\//g, '');
          value2 = outputValues[1] //.trim().replace(/'/g, '').replace(/\.\.\/React\/questionnaire-app\/public\//g, '');
          value3 = outputValues[2] //.trim().replace(/\[|\]/g, '');
          value4 = outputValues[3] //.trim().replace(/\[|\]/g, '');
          value5 = outputValues[4] //.trim().replace(/['\[\]]/g, '').replace(/\.\.\/React\/questionnaire-app\/public\//g, '');
          value6 = outputValues[5] //.trim();
          value7 = outputValues[6] //.trim().replace(/\[|\]/g, '');
          value8 = outputValues[7] //.trim().replace(/['\[\]]/g, '');

          // Now you can use value1, value2, ..., value8 as needed
        } else {
          // Handle errors, if the response is not okay
          console.error('Server responded with status:', response.status);
        }
      } else {
        // Handle errors, if the response is not okay
        console.error('Server responded with status:', response.status);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
    }

    return false;
  };

  const handleNext = () => {
    let answer;
    setAnimateLeft(false);
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
  console.log(value1)
  return completed ? (
    <div>
      <h1>Results</h1>
      <p>Question 1</p><img src={`${process.env.PUBLIC_URL}/${value1}`} alt="Value 1" />
      <p>Question 2</p><img src={`${process.env.PUBLIC_URL}/${value2}`} alt="Value 2" />
      <p>Question 3</p><img src={`${process.env.PUBLIC_URL}/${value3}`} alt="Value 3" />
      <p>Question 4</p><img src={`${process.env.PUBLIC_URL}/${value4}`} alt="Value 4" />
      <p>Question 5</p><img src={`${process.env.PUBLIC_URL}/${value5}`} alt="Value 5" />
      <p>Purity Score {value6}</p>
      <p>{value7}</p>
      <p>Your Hero:</p> <img src={`${process.env.PUBLIC_URL}/${value8}`} alt="Your Hero" />
    </div>
  ) : (
    <div>
      <header className="header">
        <img src="/realLogo.png" className="logo-left" />
        <h1>Montreal Environmental Purity Score</h1>
        <img src="/realLogo.png" className="logo-right" />
      </header>
      <div className="separator"></div>
      <div className='About'>
        <section className="website-description">
          <div className="text-container">
            <h2>About</h2>
            <p>
              Welcome to the Montreal Environmental Purity Score (MEPS) website. This platform aims to gather information about your environmental habits to assess your environmental impact. Your responses to the following questions will help us calculate your environmental purity score.
            </p>
          </div>
          <div className="image-container">
            <h3>This could be <br></br>YOU</h3>
            <img src="/logo.png" className="" />
          </div>
        </section>
      </div>
      <div className='Invitation'>
        <section className="website-invitation">
          <h2>Answer questions to learn about your eco-rank</h2>
        </section>
      </div>
      <div className="App">
        <section className="questionnaire">
          <Question question={questions[currentQuestionIndex]}>
            {currentQuestionIndex === 0 ? (
              <>
                <RadioGroup
                  options={transportationModes}
                  selectedValue={currentTransportMode}
                  onChange={handleTransportChange}
                />
                <RangeSlider
                  value={currentSliderValue}
                  onChange={handleSliderChange}
                />
              </>
            ) : currentQuestionIndex === 1 ? (
              <RadioGroup
                options={numAirplane}
                selectedValue={currentTextInput}
                onChange={handleTextInputChange}
              />
            ) : currentQuestionIndex === 2 ? (
              <RadioGroup
                options={radioCompost}
                selectedValue={currentTextInput}
                onChange={handleTextInputChange}
              />
            ) : currentQuestionIndex === 3 ? (
              <RangeSlider
                value={currentSliderValue}
                onChange={handleSliderChange}
              />
            ) : currentQuestionIndex === 4 ? (
              <RadioGroup
                options={radioDiet}
                selectedValue={currentTextInput}
                onChange={handleTextInputChange}
              />
            ) : (
              <input
                type="text"
                value={currentTextInput}
                onChange={handleTextInputChange}
              />
            )}
          </Question>
          <div className="center-button">
            <button type="button" onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}>
              {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
