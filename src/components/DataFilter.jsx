import React, { useState } from 'react';
import HistoryIcon from '@mui/icons-material/History'; // Represents historical data
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Represents live data
import DatePicker from 'react-datepicker'; // Assuming you're using a date picker library like 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const DataFilter = () => {
    const [filterOption, setFilterOption] = useState('live');
    const [cloudCoverage, setCloudCoverage] = useState(50); // Cloud coverage state
    const [selectedData, setSelectedData] = useState({
        data1: false,
        data2: false,
        data3: false,
        data4: false,
        data5: false,
        data6: false,
    });
    const [startDate, setStartDate] = useState(new Date()); // For historical data
    const [endDate, setEndDate] = useState(new Date()); // For historical data
    const [selectedSatellites, setSelectedSatellites] = useState({ // Changed to store selected satellites
        landsat8: false,
        landsat9: false,
    });
    const [notificationDelay, setNotificationDelay] = useState("15min"); // For live notification
    const [email, setEmail] = useState('');
    const [notificationType, setNotificationType] = useState('browser'); // Added notificationType state

    // Handle filter option (historical vs live)
    const handleFilterChange = (option) => {
        setFilterOption(option);
        setEmail('');
    };

    // Handle data checkbox selection
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    // Handle cloud coverage change
    const handleCloudCoverageChange = (e) => {
        setCloudCoverage(e.target.value);
    };

    // Handle satellite checkbox selection
    const handleSatelliteChange = (e) => {
        const { name, checked } = e.target;
        setSelectedSatellites((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    // Handle date selection with a max range of 16 days for historical data
    const maxHistoricalDate = new Date();
    maxHistoricalDate.setDate(maxHistoricalDate.getDate() - 16); // Limit to last 16 days

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-3/4 pr-4">
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
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Data {index + 1}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Cloud Coverage Slider */}
                            <div className="mb-6 text-center">
                                <h4 className="text-lg font-semibold mb-2">Cloud Coverage</h4>
                                <div className="flex items-center justify-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={cloudCoverage}
                                        onChange={handleCloudCoverageChange}
                                        className="mr-4 w-full lg:w-2/3"
                                    />
                                    <span className="text-white">{cloudCoverage}%</span>
                                </div>
                            </div>

                            {/* Historical/Live Data Toggle */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">Historical</span>
                                    <div
                                        style={{
                                            display: "flex",
                                            borderRadius: "100px",
                                            backgroundColor: "#0036FF80",
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
                                            <HistoryIcon style={{ color: filterOption === 'historical' ? "white" : "#FFFFFF80" }} />
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
                                            <PlayArrowIcon style={{ color: filterOption === 'live' ? "white" : "#FFFFFF80" }} />
                                        </div>
                                    </div>
                                    <span className="font-semibold">Live</span>
                                </div>
                            </div>

                            {/* Date Range for Historical Data */}
                            {filterOption === 'historical' && (
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold mb-2">Select Time Range</h4>
                                    <div className="flex space-x-4">
                                        <div>
                                            <label className="block mb-1">Start Date</label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                maxDate={maxHistoricalDate}
                                                className="px-4 py-2 w-full text-black border rounded"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1">End Date</label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                maxDate={new Date()}
                                                className="px-4 py-2 w-full text-black border rounded"
                                            />
                                        </div>
                                    </div>

                                    {/* Satellite Selection under Historical */}
                                    <h4 className="text-lg font-semibold mb-2 mt-4">Select Satellite</h4>
                                    <div className="flex flex-col space-y-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="landsat8"
                                                checked={selectedSatellites.landsat8}
                                                onChange={handleSatelliteChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Landsat 8</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="landsat9"
                                                checked={selectedSatellites.landsat9}
                                                onChange={handleSatelliteChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Landsat 9</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Satellite and Notification Options for Live Data */}
                            {filterOption === 'live' && (
                                <>
                                    {/* Notification Delay */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold mb-2">Notification Delay</h4>
                                        <select
                                            value={notificationDelay}
                                            onChange={(e) => setNotificationDelay(e.target.value)}
                                            className="px-4 py-2 w-full text-black border rounded"
                                        >
                                            <option value="15min">15 minutes</option>
                                            <option value="30min">30 minutes</option>
                                            <option value="1h">1 hour</option>
                                            <option value="2h">2 hours</option>
                                        </select>
                                    </div>

                                    {/* Notification Type */}
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold mb-2">Notification Type</h4>
                                        <div className="flex flex-col space-y-3">
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="browser"
                                                    checked={notificationType === 'browser'}
                                                    onChange={(e) => setNotificationType(e.target.value)}
                                                    className="h-4 w-4 text-black"
                                                />
                                                <span>Browser Notifications</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    value="email"
                                                    checked={notificationType === 'email'}
                                                    onChange={(e) => setNotificationType(e.target.value)}
                                                    className="h-4 w-4 text-black"
                                                />
                                                <span>Email Notifications</span>
                                            </label>
                                        </div>
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

                                    {/* Satellite Selection */}
                                    <h4 className="text-lg font-semibold mb-2">Select Satellite</h4>
                                    <div className="flex flex-col space-y-3">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="landsat8"
                                                checked={selectedSatellites.landsat8}
                                                onChange={handleSatelliteChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Landsat 8</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="landsat9"
                                                checked={selectedSatellites.landsat9}
                                                onChange={handleSatelliteChange}
                                                className="h-4 w-4 text-black"
                                            />
                                            <span>Landsat 9</span>
                                        </label>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-400">Live data may take some time to process.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DataFilter;
