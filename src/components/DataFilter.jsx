import React, { useState, useEffect } from 'react';
import { Satellite } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function DataFilter() {
    const [filterOption, setFilterOption] = useState('live');
    const [cloudCoverage, setCloudCoverage] = useState(50);
    const [selectedData, setSelectedData] = useState({
        QA_PIXEL: false,
        QA_RADSAT: false,
        SR_B1: false,
        SR_B2: false,
        SR_B3: false,
        SR_B4: false,
        SR_B5: false,
        SR_B6: false,
        SR_B7: false,
        SR_QA_AEROSOL: false,
        ST_ATRAN: false,
        ST_B10: false,
        ST_CDIST: false,
        ST_DRAD: false,
        ST_EMIS: false,
        ST_EMSD: false,
        ST_QA: false,
        ST_TRAD: false,
        ST_URAD: false
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedSatellites, setSelectedSatellites] = useState({
        landsat8: false,
        landsat9: false,
    });
    const [notificationDelay, setNotificationDelay] = useState("15min");
    const [email, setEmail] = useState('');
    const [notificationType, setNotificationType] = useState('browser');
    const [satellitePassTime, setSatellitePassTime] = useState({ landsat8: null, landsat9: null });

    useEffect(() => {
        if (selectedSatellites.landsat8) {
            setSatellitePassTime(prev => ({ ...prev, landsat8: Math.floor(Math.random() * 24) + 1 }));
        }
        if (selectedSatellites.landsat9) {
            setSatellitePassTime(prev => ({ ...prev, landsat9: Math.floor(Math.random() * 24) + 1 }));
        }
    }, [selectedSatellites]);

    const handleFilterChange = (option) => {
        setFilterOption(option);
        setEmail(''); // Clear email field if switching to live option
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedData((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleCloudCoverageChange = (e) => {
        setCloudCoverage(Number(e.target.value)); // Parse value as number
    };

    const handleSatelliteChange = (e) => {
        const { name, checked } = e.target;
        setSelectedSatellites((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add common fields
        formData.append('cloudCoverage', cloudCoverage);
        formData.append('selectedSatellites', JSON.stringify(selectedSatellites));
        formData.append('dataType', filterOption); // 'historical' or 'live'

        // Add selected data types
        Object.keys(selectedData).forEach((key) => {
            if (selectedData[key]) {
                formData.append('selectedData', key);
            }
        });

        if (filterOption === 'historical') {
            // Add historical specific data
            formData.append('startDate', startDate.toISOString());
            formData.append('endDate', endDate.toISOString());
        } else if (filterOption === 'live') {
            // Add live specific data
            formData.append('notificationDelay', notificationDelay);
            formData.append('notificationType', notificationType);
            if (notificationType === 'email') {
                formData.append('email', email);
            }
        }

        // Print out the formData object for demonstration purposes
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        // Here, you can now send this `formData` using fetch or any other method.
        // Example:
        // fetch('/api/filter', { method: 'POST', body: formData });
    };

    const maxHistoricalDate = new Date();
    const minHistoricalDate = new Date(maxHistoricalDate);
    minHistoricalDate.setDate(minHistoricalDate.getDate() - 16);

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
            <div className="max-w-4xl mx-auto bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
                <h2 className="text-4xl font-bold mb-10 text-center text-white">Landsat Data Filter</h2>

                <div className="space-y-12">
                    {/* Data Type Selection */}
                    <div className="p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-6 flex items-center justify-center text-white">
                            <Satellite className="mr-2 text-white" /> Select Data Types
                        </h3>
                        <div className="flex flex-wrap -mx-2">
                            {/* Checkbox items */}
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <label className="flex items-center bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 space-x-3 cursor-pointer hover:bg-opacity-70 transition-all duration-200 h-full">
                                    <input
                                        type="checkbox"
                                        name="QA_PIXEL"
                                        checked={selectedData['QA_PIXEL']}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-white rounded border-gray-400 focus:ring-2 focus:ring-blue-400"
                                    />
                                    <span className="text-gray-200 text-sm">QA_PIXEL</span>
                                </label>
                            </div>
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <label className="flex items-center bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 space-x-3 cursor-pointer hover:bg-opacity-70 transition-all duration-200 h-full">
                                    <input
                                        type="checkbox"
                                        name="QA_RADSAT"
                                        checked={selectedData['QA_RADSAT']}
                                        onChange={handleCheckboxChange}
                                        className="form-checkbox h-5 w-5 text-white rounded border-gray-400 focus:ring-2 focus:ring-blue-400"
                                    />
                                    <span className="text-gray-200 text-sm">QA_RADSAT</span>
                                </label>
                            </div>

                            {/* SR_ Bands (Multiple Select Dropdown) */}
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <div className="bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 h-full">
                                    <label className="text-gray-200 text-sm mb-2 block">Select SR_ Bands</label>
                                    <select
                                        multiple
                                        value={Object.keys(selectedData).filter(key => key.startsWith('SR_') && selectedData[key])}
                                        onChange={(e) => {
                                            const options = e.target.options;
                                            const selectedOptions = {};
                                            for (let i = 0; i < options.length; i++) {
                                                selectedOptions[options[i].value] = options[i].selected;
                                            }
                                            setSelectedData((prevState) => ({ ...prevState, ...selectedOptions }));
                                        }}
                                        className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="SR_B1">SR_B1 (Banda 1)</option>
                                        <option value="SR_B2">SR_B2 (Banda 2)</option>
                                        <option value="SR_B3">SR_B3 (Banda 3)</option>
                                        <option value="SR_B4">SR_B4 (Banda 4)</option>
                                        <option value="SR_B5">SR_B5 (Banda 5)</option>
                                        <option value="SR_B6">SR_B6 (Banda 6)</option>
                                        <option value="SR_B7">SR_B7 (Banda 7)</option>
                                        <option value="SR_QA_AEROSOL">SR_QA_AEROSOL</option>
                                    </select>
                                </div>
                            </div>

                            {/* ST_ Values (Multiple Select Dropdown) */}
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <div className="bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 h-full">
                                    <label className="text-gray-200 text-sm mb-2 block">Select ST_ Values</label>
                                    <select
                                        multiple
                                        value={Object.keys(selectedData).filter(key => key.startsWith('ST_') && selectedData[key])}
                                        onChange={(e) => {
                                            const options = e.target.options;
                                            const selectedOptions = {};
                                            for (let i = 0; i < options.length; i++) {
                                                selectedOptions[options[i].value] = options[i].selected;
                                            }
                                            setSelectedData((prevState) => ({ ...prevState, ...selectedOptions }));
                                        }}
                                        className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="ST_ATRAN">ST_ATRAN</option>
                                        <option value="ST_B10">ST_B10</option>
                                        <option value="ST_CDIST">ST_CDIST</option>
                                        <option value="ST_DRAD">ST_DRAD</option>
                                        <option value="ST_EMIS">ST_EMIS</option>
                                        <option value="ST_EMSD">ST_EMSD</option>
                                        <option value="ST_QA">ST_QA</option>
                                        <option value="ST_TRAD">ST_TRAD</option>
                                        <option value="ST_URAD">ST_URAD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cloud Coverage */}
                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-6 text-white">Cloud Coverage (%)</h3>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={cloudCoverage}
                            onChange={handleCloudCoverageChange}
                            className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-center text-gray-200 mt-2">
                            {cloudCoverage}%
                        </div>
                    </div>

                    {/* Date and Satellite Selection */}
                    {filterOption === 'historical' ? (
                        <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-6 text-white">Select Date Range</h3>
                            <div className="flex justify-between space-x-4">
                                <div className="w-full">
                                    <label className="text-gray-200 block mb-2">Start Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={setStartDate}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        maxDate={maxHistoricalDate}
                                        minDate={minHistoricalDate}
                                        className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>
                                <div className="w-full">
                                    <label className="text-gray-200 block mb-2">End Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={setEndDate}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        maxDate={maxHistoricalDate}
                                        minDate={startDate}
                                        className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-6 text-blue-300">Select Notification Options</h3>
                            <div className="flex justify-between space-x-4">
                                <div className="w-full">
                                    <label className="text-gray-200 block mb-2">Notification Type</label>
                                    <select
                                        value={notificationType}
                                        onChange={(e) => setNotificationType(e.target.value)}
                                        className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    >
                                        <option value="browser">Browser Notification</option>
                                        <option value="email">Email Notification</option>
                                    </select>
                                </div>
                                {notificationType === 'email' && (
                                    <div className="w-full">
                                        <label className="text-gray-200 block mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-gray-700 text-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Satellite Selection */}
                    <div className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-6 text-blue-300">Select Satellites</h3>
                        <div className="flex space-x-4">
                            <div className="w-full">
                                <label className="flex items-center bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 space-x-3 cursor-pointer hover:bg-opacity-70 transition-all duration-200 h-full">
                                    <input
                                        type="checkbox"
                                        name="landsat8"
                                        checked={selectedSatellites['landsat8']}
                                        onChange={handleSatelliteChange}
                                        className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-400 focus:ring-2 focus:ring-blue-400"
                                    />
                                    <span className="text-gray-200 text-sm">Landsat 8</span>
                                </label>
                            </div>
                            <div className="w-full">
                                <label className="flex items-center bg-gray-600 bg-opacity-60 shadow-md rounded-md p-4 space-x-3 cursor-pointer hover:bg-opacity-70 transition-all duration-200 h-full">
                                    <input
                                        type="checkbox"
                                        name="landsat9"
                                        checked={selectedSatellites['landsat9']}
                                        onChange={handleSatelliteChange}
                                        className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-400 focus:ring-2 focus:ring-blue-400"
                                    />
                                    <span className="text-gray-200 text-sm">Landsat 9</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow-md"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
