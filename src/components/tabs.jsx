// src/components/ui/tabs.jsx
import React, { useState } from 'react';

export function Tabs({ children, defaultValue, className }) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <div className={className}>
        {React.Children.map(children, (child) =>
            React.cloneElement(child, { activeTab, setActiveTab })
        )}
        </div>
    );
}

export function TabsList({ children }) {
    return <div className="flex space-x-4">{children}</div>;
}

export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 ${activeTab === value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, activeTab }) {
    return activeTab === value ? <div className="mt-4">{children}</div> : null;
}
