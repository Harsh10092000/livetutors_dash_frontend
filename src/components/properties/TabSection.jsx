import React, { useState } from 'react';

const TabSection = ({ allPropertiesLength, onTabChange }) => {
  const [activeTab, setActiveTab] = useState('All Jobs');

  const tabs = [
    {
      label: 'All Jobs',
      isSelected: activeTab === 'All Jobs',
      length: allPropertiesLength,
    },
    {
      label: 'Listed Jobs',
      isSelected: activeTab === 'Listed Jobs',
      length: null,
    },
    {
      label: 'Delisted/Expired',
      isSelected: activeTab === 'Delisted/Expired',
      length: null,
    },
    {
      label: 'Sold Out Jobs',
      isSelected: activeTab === 'Sold Out Jobs',
      length: null,
    },
  ];

  const handleTabClick = (label) => {
    setActiveTab(label);
    if (onTabChange) {
      onTabChange(label);
    }
  };

  return (
    <div className="tab_section_wrapper">
      <div className="tab_section">
        {tabs.map((tab) => (
          <div
            key={tab.label}
            onClick={() => handleTabClick(tab.label)}
            className={`tab_section-item ${tab.isSelected ? 'tab_section-item-selected' : ''}`}
          >
            {tab.label}
            {tab.length !== null && (
              <span className="tab-section-length">{tab.length}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSection;