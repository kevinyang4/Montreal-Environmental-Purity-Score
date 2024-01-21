import React from 'react';

const Results = ({ processedResults }) => {
  const outputValues = processedResults.output.split(',').map(val => val.trim());

  if (outputValues.length < 8) {
    return (
      <div>
        <h1>Results</h1>
        <h2>What’s your preferred method of transportation and how often do you use it?</h2>
        <p>Not enough values in the output</p>
      </div>
    );
  }

  const sanitizeValue = (value, regex, replacement = '') => value.replace(regex, replacement);

  const extractImageName = (path) => {
    const match = path.match(/.*\/(plot_[\w-]+.png)'/);
    return match ? match[1] : '';
  };

  const value1 = sanitizeValue(outputValues[0], /['[]]/g);
  const value2 = sanitizeValue(outputValues[1], /['[]]/g);
  const value3 = sanitizeValue(outputValues[2], /[|]/g);
  const value4 = sanitizeValue(outputValues[3], /[|]/g);
  const value5 = extractImageName(outputValues[4]);
  const value6 = outputValues[5];
  const value7 = sanitizeValue(outputValues[6], /[|]/g);
  const value8 = sanitizeValue(outputValues[7], /['[]]/g);

  return (
    <div>
      <h1>Results</h1>
      <h2>What’s your preferred method of transportation and how often do you use it?</h2>

      <p>Value 1</p>
      <img src={`${process.env.PUBLIC_URL}/${value1}`} alt="Descriptive Text" />

      <p>Value 2</p>
      <img src={`${process.env.PUBLIC_URL}/${value2}`} alt="Descriptive Text" />
      <p>Value 3</p>
      <img src={`${process.env.PUBLIC_URL}/${value3}`} alt="Descriptive Text" />
      <p>Value 4</p>
      <img src={`${process.env.PUBLIC_URL}/${value4}`} alt="Descriptive Text" />

      <p>Value 5</p>
      <img src={`${process.env.PUBLIC_URL}/${value5}`} alt="Descriptive Text" />

      <p>Purity Score {value6}</p>
      <p>{value7}</p>
      <p>Your Hero:</p> 
      <img src={`${process.env.PUBLIC_URL}/${value8}`} alt="Descriptive Text" />
    </div>
  );
};

export default Results;
