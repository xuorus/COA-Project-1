import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';

const NumberingContext = createContext();

const NumberingProvider = ({ children }) => {
  const [nameData, setNameData] = useState(() => {
    const savedData = localStorage.getItem('numberingData');
    return savedData ? new Map(JSON.parse(savedData)) : new Map();
  });

  const updateName = useCallback((cellId, value) => {
    setNameData(prev => {
      const newMap = new Map(prev);
      if (value) {
        // Store both the name and timestamp
        newMap.set(cellId, { 
          name: value, 
          timestamp: Date.now() 
        });
      } else {
        newMap.delete(cellId);
      }
      return newMap;
    });
  }, []);

  // Memoize the nameData entries array
  const memoizedEntries = useMemo(() => {
    return Array.from(nameData.entries()).map(([id, data]) => ({
      id,
      timestamp: data.timestamp
    }));
  }, [nameData]);

  const getNumber = useCallback((cellId) => {
    if (!nameData.has(cellId)) return '-';
    
    // Use memoized entries
    const sortedCells = [...memoizedEntries].sort((a, b) => a.timestamp - b.timestamp);
    return sortedCells.findIndex(cell => cell.id === cellId) + 1;
  }, [memoizedEntries, nameData]);

  useEffect(() => {
    localStorage.setItem('numberingData', JSON.stringify(Array.from(nameData.entries())));
  }, [nameData]);

  return (
    <NumberingContext.Provider value={{ nameData, updateName, getNumber }}>
      {children}
    </NumberingContext.Provider>
  );
};

export { NumberingContext, NumberingProvider };