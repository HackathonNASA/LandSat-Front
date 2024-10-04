import React, { useState } from 'react';

const ContactForm = () => {
    const [formStatus, setFormStatus] = useState('');
    const [errorDetails, setErrorDetails] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        try {
            const response = await fetch('http://localhost:4321/api/send-email', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('Message sent successfully!');
                setErrorDetails('');
                event.target.reset();
            } else {
                throw new Error(data.message || 'Server response was not ok.');
            }
        } catch (error) {
            console.error('Error:', error); // Esto imprime el error en la consola
            setFormStatus('There was an error sending your message. Please try again.');
            setErrorDetails(error.message || 'Unknown error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 backdrop-blur-md bg-opacity-20 bg-blue-900 p-8 rounded-lg shadow-2xl border border-blue-500">
            <div>
                <label htmlFor="name" className="block text-lg font-medium text-blue-300 mb-2">Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-lg font-medium text-blue-300 mb-2">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                />
            </div>
            <div>
                <label htmlFor="message" className="block text-lg font-medium text-blue-300 mb-2">Message</label>
                <textarea
                    id="message"
                    name="message"
                    rows="5"
                    required
                    className="w-full px-4 py-3 rounded-md bg-gray-800 text-white border border-blue-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-300"
                ></textarea>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wide"
            >
                Send
            </button>
            {formStatus && (
                <div className={`mt-4 p-4 rounded-md ${formStatus.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {formStatus}
                    {errorDetails && <p className="mt-2 text-sm">{errorDetails}</p>}
                </div>
            )}
        </form>
    );
};

export default ContactForm;
