// DataFilter.jsx
import React, { useState } from 'react';
import HistoryIcon from '@mui/icons-material/History'; // Represents historical data
import PlayArrowIcon from '@mui/icons-material/PlayArrow'; // Represents live data

const DataFilter = () => {
    const [filterOption, setFilterOption] = useState('live');
    const [notificationType, setNotificationType] = useState('browser');
    const [email, setEmail] = useState('');

    const handleFilterChange = (option) => {
        setFilterOption(option);
        // Reset notification type and email when toggling filter options
        setNotificationType('browser');
        setEmail('');
    };

    const handleNotificationChange = (e) => {
        setNotificationType(e.target.value);
    };

    return (
        <div className="relative z-10 py-4"> {/* Adjusted to match the layout */}
            <h3 className="text-2xl font-bold mb-2">Filter</h3> {/* Adjusted heading size */}
            <p className="mb-2">
                Switch to live in order to get notifications and results for a Landsat passing by a specific location.
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
                <span className="text-white-500 font-bold mr-2">Historical</span>
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
                <span className="text-white-500 font-bold ml-2">Live</span>
            </div>

            {/* Notification Options */}
            {filterOption === 'live' && (
                <div className="mt-4">
                    <h4 className="text-md font-semibold mb-2">Notification Type</h4>
                    <div className="flex flex-col space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="browser"
                                checked={notificationType === 'browser'}
                                onChange={handleNotificationChange}
                                className="mr-2"
                            />
                            Browser Notifications
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="email"
                                checked={notificationType === 'email'}
                                onChange={handleNotificationChange}
                                className="mr-2"
                            />
                            Email Notifications
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
                                className="w-full px-3 py-2 border rounded text-black"
                                required
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DataFilter;
