// ResultsDisplay.jsx
import React from 'react';

const ResultsDisplay = ({ pins }) => {
    return (
        <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            {pins.length > 0 ? (
                <ul className="list-disc pl-5">
                    {pins.map((pin, index) => (
                        <li key={index} className="mb-2">
                            Latitude: {pin.lat.toFixed(2)}, Longitude: {pin.lng.toFixed(2)}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No results found. Please add a pin.</p>
            )}
        </div>
    );
};

export default ResultsDisplay;
