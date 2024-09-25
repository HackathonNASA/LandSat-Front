// src/components/ui/input.jsx
import React from 'react';

export function Input({ id, type = 'text', value, onChange, placeholder }) {
    return (
        <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 border rounded-md w-full"
        />
    );
}
