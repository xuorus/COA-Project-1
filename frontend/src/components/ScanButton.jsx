import React from "react";

const ScanButton = () => {
    const handleScan = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/scan", { method: "POST" });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error scanning document:", error);
        }
    };

    return (
        <button onClick={handleScan} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Scan Document
        </button>
    );
};

export default ScanButton;