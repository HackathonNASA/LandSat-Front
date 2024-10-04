import React, { useState } from 'react';
import HistoryIcon from '@mui/icons-material/History'; // Represents historical data
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Represents live data

//DATA FILTER USED IN TOOL SECTION
const DataFilter = () => {
    const [filterOption, setFilterOption] = useState('live');
    const [notificationType, setNotificationType] = useState('browser');
    const [email, setEmail] = useState('');
    const [cloudCoverage, setCloudCoverage] = useState(50); // Cloud coverage state
    const [selectedData, setSelectedData] = useState({
        data1: false,
        data2: false,
        data3: false,
        data4: false,
        data5: false,
        data6: false,
    });

    const handleFilterChange = (option) => {
        setFilterOption(option);
        // Reset notification type and email when toggling filter options
        setNotificationType('browser');
        setEmail('');
    };

    const handleNotificationChange = (e) => {
        setNotificationType(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleCloudCoverageChange = (e) => {
        setCloudCoverage(e.target.value);
    };

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-3/4 pr-4"> {/* Adjust width and alignment */}
                        <div className="relative z-10 py-4 text-white">
                            <h3 className="text-2xl font-bold mb-4 text-left">Filter Options</h3>

                            {/* Data Selection Checkboxes */}
                            <div className="mb-6 text-left">
                                <h4 className="text-lg font-semibold mb-2">Select Data Types</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.keys(selectedData).map((dataType, index) => (
                                        <label key={index} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name={dataType}
                                                checked={selectedData[dataType]}
                                                onChange={handleCheckboxChange}
                                                className="h-4 w-4 text-black" // Ensure checkbox is visible
                                            />
                                            <span>Data {index + 1}</span> {/* Placeholder for actual data names */}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Cloud Coverage Slider */}
                            <div className="mb-6 text-center"> {/* Centered cloud coverage */}
                                <h4 className="text-lg font-semibold mb-2">Cloud Coverage</h4>
                                <div className="flex items-center justify-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={cloudCoverage}
                                        onChange={handleCloudCoverageChange}
                                        className="mr-4 w-full lg:w-2/3" // Smaller width for larger screens
                                    />
                                    <span className="text-white">{cloudCoverage}%</span>
                                </div>
                            </div>

                            {/* Historical/Live Data Toggle */}
                            <div className="flex items-center justify-center mb-6"> {/* Centered toggle */}
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Historical</span>
                                    <div
                                        style={{
                                            display: "flex",
                                            borderRadius: "100px",
                                            backgroundColor: "#0036FF80", // Transparent blue background for the toggle
                                            position: "relative",
                                            width: "140px",
                                            height: "32px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "50%",
                                                height: "100%",
                                                backgroundColor: "#0036FF",
                                                borderRadius: "40px",
                                                transition: "transform 0.3s ease",
                                                transform: filterOption === "live" ? "translateX(100%)" : "translateX(0)",
                                            }}
                                        />
                                        <div
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: 1,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterChange('historical')}
                                        >
                                            <HistoryIcon style={{ color: filterOption === 'historical' ? "white" : `#FFFFFF80` }} />
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: 1,
                                                cursor: "pointer",
                                            }}
                                            onClick={() => handleFilterChange('live')}
                                        >
                                            <PlayArrowIcon style={{ color: filterOption === 'live' ? "white" : `#FFFFFF80` }} />
                                        </div>
                                    </div>
                                    <span className="font-semibold">Live</span>
                                </div>
                            </div>

                            {/* Notification Options */}
                            {filterOption === 'live' && (
                                <div className="mb-4 text-left">
                                    <h4 className="text-lg font-semibold mb-2">Notification Type</h4>
                                    <div className="flex flex-col space-y-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="browser"
                                                checked={notificationType === 'browser'}
                                                onChange={handleNotificationChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Browser Notifications</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="email"
                                                checked={notificationType === 'email'}
                                                onChange={handleNotificationChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Email Notifications</span>
                                        </label>
                                    </div>

                                    {/* Email Input Field */}
                                    {notificationType === 'email' && (
                                        <div className="mt-4">
                                            <label htmlFor="email" className="block mb-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="e.g., example@mail.com"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black" // Text input style
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DataFilter;
