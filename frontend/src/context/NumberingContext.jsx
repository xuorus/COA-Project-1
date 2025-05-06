import React, { createContext, useContext, useState } from 'react';

const NumberingContext = createContext();

export function useNumbering() {
  return useContext(NumberingContext);
}

export function NumberingProvider({ children }) {
  const [nameEntries, setNameEntries] = useState([]);

  const updateName = (cellId, name) => {
    setNameEntries(prev => {
      const filtered = prev.filter(entry => entry.cellId !== cellId);
      
      if (name) {
        const newEntries = [...filtered, {
          cellId,
          name
        }];
        
        // Sort by cellId numeric value to maintain row order
        return newEntries.sort((a, b) => {
          const rowA = parseInt(a.cellId.split('-')[1]);
          const rowB = parseInt(b.cellId.split('-')[1]);
          return rowA - rowB;
        });
      }
      return filtered;
    });
  };

  const getNumber = (cellId) => {
    // Sort entries by row number before assigning numbers
    const sortedEntries = [...nameEntries].sort((a, b) => {
      const rowA = parseInt(a.cellId.split('-')[1]);
      const rowB = parseInt(b.cellId.split('-')[1]);
      return rowA - rowB;
    });

    const index = sortedEntries.findIndex(entry => entry.cellId === cellId);
    return index > -1 ? index + 1 : '';
  };

  return (
    <NumberingContext.Provider value={{ updateName, getNumber, nameEntries }}>
      {children}
    </NumberingContext.Provider>
  );
}

export { NumberingContext };