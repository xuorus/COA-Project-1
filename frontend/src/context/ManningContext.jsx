import React, { createContext, useState, useContext, useEffect } from 'react';

const ManningContext = createContext();

export const ManningProvider = ({ children }) => {
  const [manningData, setManningData] = useState(() => {
    // Load initial data from localStorage
    const savedData = localStorage.getItem('manningData');
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('manningData', JSON.stringify(manningData));
  }, [manningData]);

  const updateManningData = (cellId, value) => {
    setManningData(prev => ({
      ...prev,
      [cellId]: value
    }));
  };

  return (
    <ManningContext.Provider value={{ manningData, updateManningData }}>
      {children}
    </ManningContext.Provider>
  );
};

export const useManningContext = () => useContext(ManningContext);