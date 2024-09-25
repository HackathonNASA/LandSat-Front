// src/components/ui/radio-group.jsx
import React from 'react';

export function RadioGroup({ children, value, onValueChange, className }) {
    return (
        <div className={className}>
            {React.Children.map(children, (child) =>
            React.cloneElement(child, { selectedValue: value, onValueChange })
            )}
        </div>
    );
}

export function RadioGroupItem({ value, id, selectedValue, onValueChange, children }) {
    return (
        <label className="flex items-center space-x-2">
        <input
            type="radio"
            id={id}
            value={value}
            checked={selectedValue === value}
            onChange={() => onValueChange(value)}
            className="form-radio"
        />
        {children}
        </label>
    );
}
