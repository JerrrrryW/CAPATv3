import React, { useState } from 'react';
import './TabbedComponent.css';
import AlgorithmView from './AlgorithmView';

function TabbedComponent() {
  const [activeTab, setActiveTab] = useState(0);
  const algorithmList = ['SIFT', 'SURF', 'ORB', 'AKAZE', 'BRISK', 'KAZE'];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="tabs">
        <button
          className={activeTab === 0 ? 'active' : ''}
          onClick={() => handleTabClick(0)}
        >
          考证系统
        </button>
        <button
          className={activeTab === 1 ? 'active' : ''}
          onClick={() => handleTabClick(1)}
        >
          目鉴系统
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 0 && <p>内容1</p>}
        {activeTab === 1 && 
            <div>
                <p>图像处理算法</p>
                <AlgorithmView inputArray={algorithmList} />
            </div>
        }
      </div>
    </div>
  );
}

export default TabbedComponent;
