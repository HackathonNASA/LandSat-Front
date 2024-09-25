// src/components/ui/button.jsx
import React from 'react';

export function Button({ children, onClick, variant = 'primary' }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded ${variant === 'secondary' ? 'bg-gray-500' : 'bg-blue-500'} text-white`}
        >
        {children}
        </button>
    );
}
