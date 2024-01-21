// import React, {useState, useEffect} from 'react'
// import api from './api'

// const App = () => {
//   const[questionnaire, setQuestionnaire] = useState([]);
//   const[formData, setFormData] = useState({
//     prompt1 : '',
//     prompt2: '',
//     prompt3: '',
//     prompt4: '',
//     prompt5: ''

//   });


//   const fetchQuestionnaire = async () => {
//     const response = await api.get('/questionnaire/');
//     setQuestionnaire(response.data)
//   };

//   useEffect(() => {
//     fetchQuestionnaire();
//   }, []);

//   const handleInputChange = (event) => {
//     const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
//     setFormData({
//       ... formData,
//       [event.target.name]: value,
//     });
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     await api.post('/questionnaire/', formData);
//     fetchQuestionnaire();
//     setFormData({
//       prompt1 : '',
//       prompt2: '',
//       prompt3: '',
//       prompt4: '',
//       prompt5: ''
//     });
//   };
//   return(
//     <div>
//       <nav className='navbar navbar-dark bg-primary'>
//           <div className='container-fluid'>
//               <a className='navbar-brand' href="#">
//                   Questionnaire App
//               </a>
//           </div>
//       </nav>
//       <div className='container'>
//         <form onSubmit={handleFormSubmit}>
//           <div className='mb-3 mt-3'>
//             <label htmlFor='amount' className='form-label'>
//               Amount
//             </label>
//             <input type='text' className='form-control' id='amount' name='amount' onChange={handleInputChange} value={formData.amount}/>
//           </div>

//         </form>

//       </div>
//     </div>
//   )
// }

// export default App;

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
    let answer = currentQuestionIndex === 0
      ? `${currentTransportMode}, ${currentSliderValue}`
      : currentTextInput;

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = answer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentTextInput('');
      setCurrentSliderValue('0.5'); // Reset slider for next use if needed
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
