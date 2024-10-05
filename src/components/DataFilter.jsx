import React, { useState, useEffect } from 'react';
import { Satellite, CloudQueue, History, PlayArrow, Notifications, Email } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function DataFilter() {
    const filterUrl = 'http://localhost:4321/api/apply-filters';
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
        setEmail('');
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

    const handleSatelliteChange = (e) => {
        const { name, checked } = e.target;
        setSelectedSatellites((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const maxHistoricalDate = new Date();
    const minHistoricalDate = new Date(maxHistoricalDate);
    minHistoricalDate.setDate(minHistoricalDate.getDate() - 16);

    const handleSubmit = async (e) => {
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

        try {
            const response = await fetch(filterUrl, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('Filters applied successfully!');
                setErrorDetails('');
                e.target.reset();
            } else {
                throw new Error(data.message || 'Server response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error);
            setFormStatus('There was an error applying the filters. Please try again.');
            setErrorDetails(error.message || 'Unknown error occurred');
        }
    };

    const groupedData = Object.keys(selectedData).reduce((acc, key) => {
        const prefix = key.split('_')[0];
        if (!acc[prefix]) {
            acc[prefix] = [];
        }
        acc[prefix].push(key);
        return acc;
    }, {});

    return (
        <div className="mb-28 text-white p-8">
            <div className="max-w-4xl mx-auto bg-black bg-opacity-60 rounded-lg shadow-lg p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-bold mb-8 text-center">Landsat Data Filter</h2>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Data Type Selection */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-4 flex items-center justify-center text-white">
                            <Satellite className="mr-2 text-blue-400" /> Select Data Types
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {Object.entries(groupedData).map(([prefix, dataTypes]) => (
                                <div key={prefix} className="bg-gray-800 bg-opacity-60 rounded-lg p-4 w-64">
                                    <h4 className="text-lg font-semibold mb-2">Select {prefix}_ Values</h4>
                                    <div className="h-48 overflow-y-auto">
                                        {dataTypes.map((dataType) => (
                                            <label key={dataType} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="checkbox"
                                                    name={dataType}
                                                    checked={selectedData[dataType]}
                                                    onChange={handleCheckboxChange}
                                                    className="form-checkbox h-5 w-5 text-blue-400 rounded border-gray-600 focus:ring focus:ring-blue-200"
                                                />
                                                <span className="text-gray-300 text-sm">{dataType}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cloud Coverage */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4 flex justify-center items-center">
                            <CloudQueue className="mr-2" /> Cloud Coverage
                        </h3>
                        <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={cloudCoverage}
                                onChange={handleCloudCoverageChange}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-lg font-semibold">{cloudCoverage}%</span>
                        </div>
                    </div>

                    {/* Historical/Live Toggle */}
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Data Mode</h3>
                        <div className="flex justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => handleFilterChange('historical')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${filterOption === 'historical' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <History />
                                <span>Historical</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleFilterChange('live')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${filterOption === 'live' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                                <Notifications />
                                <span>Live</span>
                            </button>
                        </div>
                    </div>

                    {/* Historical Data Options */}
                    {filterOption === 'historical' && (
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Historical Data Options</h3>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div>
                                    <label className="block mb-2">Start Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        maxDate={maxHistoricalDate}
                                        minDate={minHistoricalDate}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2">End Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        maxDate={new Date()}
                                        minDate={startDate}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Live Data Options */}
                    {filterOption === 'live' && (
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Live Data Options</h3>
                            <div className="grid grid-cols-2 gap-32 max-w-md mx-auto">
                                <div>
                                    <label className="block mb-2">Notification Delay</label>
                                    <select
                                        value={notificationDelay}
                                        onChange={(e) => setNotificationDelay(e.target.value)}
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                                    >
                                        <option value="15min">15 minutes</option>
                                        <option value="30min">30 minutes</option>
                                        <option value="1h">1 hour</option>
                                        <option value="2h">2 hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-4">Notification Type</label>
                                    <div className="flex items-center justify-center gap-5">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="browser"
                                                checked={notificationType === 'browser'}
                                                onChange={(e) => setNotificationType(e.target.value)}
                                                className="form-radio h-5 w-5 text-blue-600"
                                            />
                                            <span className="flex items-center">
                                                <Notifications className="mr-2" /> Browser
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                value="email"
                                                checked={notificationType === 'email'}
                                                onChange={(e) => setNotificationType(e.target.value)}
                                                className="form-radio h-5 w-5 text-blue-600"
                                            />
                                            <span className="flex items-center">
                                                <Email className="mr-2" /> Email
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {notificationType === 'email' && (
                                <div className="max-w-md mx-auto">
                                    <label htmlFor="email" className="block mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                                        required={notificationType === 'email'}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Satellite Selection */}
                    <div className="text-center space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Select Satellites</h3>
                        <div className="inline-grid grid-cols-2 gap-4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="landsat8"
                                    checked={selectedSatellites.landsat8}
                                    onChange={handleSatelliteChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span>Landsat 8</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="landsat9"
                                    checked={selectedSatellites.landsat9}
                                    onChange={handleSatelliteChange}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span>Landsat 9</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
