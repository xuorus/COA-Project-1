import React, { useState } from "react";

const ScanButton = ({ documentType }) => {
    const [scanning, setScanning] = useState(false);

    const handleScan = async () => {
        setScanning(true);
        try {
            const endpoint = documentType === "PDS" ? "/api/scan/pds" : "/api/scan/saln";
            
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert(`${documentType} file successfully scanned and stored!`);
            } else {
                alert(`Failed to scan ${documentType}: ${data.message}`);
            }
        } catch (error) {
            console.error(`Error scanning ${documentType}:`, error);
            alert(`Error scanning ${documentType}. Please try again.`);
        } finally {
            setScanning(false);
        }
    };

    return (
        <button 
            onClick={handleScan} 
            className={`px-4 py-2 ${scanning ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-md`}
            disabled={scanning || !documentType}
        >
            {scanning ? 'Scanning...' : `Scan ${documentType || 'Document'}`}
        </button>
    );
};

export default ScanButton;