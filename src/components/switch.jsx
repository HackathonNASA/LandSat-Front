// src/components/ui/switch.jsx
import React from 'react';

export function Switch({ checked, onChange }) {
    return (
        <label className="flex items-center">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="form-switch"
        />
        <span className="ml-2">{checked ? 'On' : 'Off'}</span>
        </label>
    );
}
