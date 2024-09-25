// src/components/ui/card.jsx
import React from 'react';

export function Card({ children }) {
    return <div className="p-4 bg-white rounded shadow">{children}</div>;
}

export function CardHeader({ children }) {
    return <div className="mb-2">{children}</div>;
}

export function CardTitle({ children }) {
    return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardDescription({ children }) {
    return <p className="text-sm text-gray-500">{children}</p>;
}

export function CardContent({ children }) {
    return <div className="mt-2">{children}</div>;
}

export function CardFooter({ children }) {
    return <div className="mt-4">{children}</div>;
}
