import React, { useState } from "react";

const ScanButton = ({ documentType }) => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = async () => {
        setScanning(true);
        setError(null);
        try {
            const endpoint = documentType === "PDS" ? "/api/scan/pds" : "/api/scan/saln";
            
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    documentType,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                alert(`${documentType} file successfully scanned and stored!\nFile ID: ${data.fileId}`);
            } else {
                setError(data.message);
                alert(`Failed to scan ${documentType}: ${data.message}`);
            }
        } catch (error) {
            console.error(`Error scanning ${documentType}:`, error);
            setError(error.message);
            alert(`Error scanning ${documentType}. Please try again.`);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button 
                onClick={handleScan} 
                className={`px-4 py-2 ${scanning ? 'bg-gray-500' : 'bg-blue-500'} 
                    text-white rounded-md hover:opacity-90`}
                disabled={scanning || !documentType}
            >
                {scanning ? 'Scanning...' : `Scan ${documentType || 'Document'}`}
            </button>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
    );
};

export default ScanButton;