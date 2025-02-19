import React, { useEffect, useState } from "react";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        setDocuments(["scanned_image.jpg"]);
    }, []);

    return (
        <div>
            <h2 className="text-lg font-bold">Scanned Documents</h2>
            <ul>
                {documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;
