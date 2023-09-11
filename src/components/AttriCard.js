import React, { useState } from 'react';

function AttriCard({ attris }) {
  const [parameterValues, setParameterValues] = useState({});

  const handleSliderChange = (attrName) => (event) => {
    const newValue = event.target.value;
    setParameterValues((prevValues) => ({
      ...prevValues,
      [attrName]: newValue,
    }));
  };

  return (
    <div className="card">
      <div className="card-header">参数调整</div>
      <div className="card-body" style={
        {
          padding: '10px',
        }
      }>
        {attris.map((attr) => (
          <div key={attr.name}>
            <label htmlFor={attr.name}>{attr.name}</label>
            <input
              type="range"
              min={attr.min}
              max={attr.max}
              value={parameterValues[attr.name] || attr.min}
              onChange={handleSliderChange(attr.name)}
              id={attr.name}
            />
            <span>{parameterValues[attr.name] || attr.min}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttriCard;
