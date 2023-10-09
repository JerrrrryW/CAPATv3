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
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
        }
      }>
        {attris.map((attr) => (
          <div key={attr.name}
            style={{
              display: 'flex',
              marginBottom: '10px',
            }}
          >
            <label htmlFor={attr.name}>{attr.name}</label>
            <input
              type="range"
              min={attr.min}
              max={attr.max}
              value={parameterValues[attr.name] || attr.value}
              onChange={handleSliderChange(attr.name)}
              id={attr.name}
              style={{
                marginLeft: '10px',
                marginRight: '10px',
                
              }}
            />
            <span>{parameterValues[attr.name] || attr.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttriCard;
