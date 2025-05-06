import React, { createContext, useContext, useState } from 'react';
import { sortByCellId } from './numberingUtils';
import PropTypes from 'prop-types';

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
        const newEntries = [...filtered, { cellId, name }];
        return newEntries.sort(sortByCellId);
      }
      return filtered;
    });
  };

  const getNumber = (cellId) => {
    const sortedEntries = [...nameEntries].sort(sortByCellId);
    const index = sortedEntries.findIndex(entry => entry.cellId === cellId);
    return index > -1 ? index + 1 : '';
  };

  return (
    <NumberingContext.Provider value={{ updateName, getNumber, nameEntries }}>
      {children}
    </NumberingContext.Provider>
  );
}

NumberingProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export { NumberingContext };