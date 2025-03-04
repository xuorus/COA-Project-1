import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ScanButton = ({ documentType, onScanComplete }) => {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [scannerStatus, setScannerStatus] = useState(null);

    // Check scanner status periodically when scanning
    useEffect(() => {
        let statusInterval;
        if (scanning) {
            statusInterval = setInterval(checkScannerStatus, 5000);
        }
        return () => clearInterval(statusInterval);
    }, [scanning]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scanning) {
                cancelScan();
            }
        };
    }, []);

    const checkScannerStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/scan/status`);
            const data = await response.json();
            setScannerStatus(data.status);
            return data.ready;
        } catch (error) {
            console.error('Scanner status check failed:', error);
            return false;
        }
    };

    const cancelScan = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/scan/cancel`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" }
            });
        } catch (error) {
            console.error('Failed to cancel scan:', error);
        }
    };

    const handleScan = async () => {
        setScanning(true);
        setError(null);

        try {
            // Check scanner status first
            const isReady = await checkScannerStatus();
            if (!isReady) {
                throw new Error('Scanner not ready. Please check connection.');
            }

            const response = await fetch(`${API_BASE_URL}/api/scan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    documentType,
                    timestamp: new Date().toISOString()
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            if (data.success) {
                toast.success(`${documentType} scanned successfully!`);
                if (onScanComplete) {
                    onScanComplete(data);
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(`Error scanning ${documentType}:`, error);
            setError(error.message);
            toast.error(`Scanning failed: ${error.message}`);
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button 
                onClick={handleScan} 
                className={`px-4 py-2 ${scanning ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition-colors duration-200 disabled:opacity-50 min-w-[150px]`}
                disabled={scanning || !documentType}
            >
                {scanning ? (
                    <div className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Scanning...
                    </div>
                ) : (
                    `Scan ${documentType || 'Document'}`
                )}
            </button>
            
            {error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}
            
            {scannerStatus && (
                <div className={`mt-2 text-sm ${scannerStatus === 'ready' ? 'text-green-600' : 'text-amber-600'}`}>
                    Scanner status: {scannerStatus}
                </div>
            )}
        </div>
    );
};

export default ScanButton;