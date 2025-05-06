import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const RecordsContext = createContext();

export function useRecords() {
  return useContext(RecordsContext);
}

export function RecordsProvider({ children }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/records');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <RecordsContext.Provider value={{ records, setRecords }}>
      {children}
    </RecordsContext.Provider>
  );
}