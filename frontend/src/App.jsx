import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/scanner/scans")
      .then(response => setScans(response.data))
      .catch(error => console.error("Error fetching scans:", error));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">COA Scanner System</h1>
      <ul>
        {scans.map(scan => (
          <li key={scan.id}>{scan.document_name} - {scan.scanned_at}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
