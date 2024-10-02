import React, { useState, useEffect } from 'react';

export const News = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        async function fetchNews() {
            const url = 'https://newsapi.org/v2/everything?' +
                'q=Landsat&' +
                'language=en&' +
                'sortBy=relevancy&' +
                'apiKey=b85c94394aad4430baf3a29b1b81ffde';

            const req = new Request(url);

            try {
                const response = await fetch(req);
                const data = await response.json();
                console.log('API response status:', data.status);
                console.log('Fetched news:', data.articles); // Debugging log
                setNews(data.articles);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        }

        fetchNews();
    }, []);

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-bold mb-8 text-white text-center tracking-wide">
                    Landsat News
                </h1>
                <ul className="space-y-4">
                    {news.length > 0 ? (
                        news.map((article) => (
                            <li key={article.url} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    <h2 className="text-2xl font-semibold">{article.title}</h2>
                                </a>
                                <p className="text-gray-400">{article.description}</p>
                                <p className="text-gray-500 text-sm">Published at: {new Date(article.publishedAt).toLocaleDateString()}</p>
                            </li>
                        ))
                    ) : (
                        <p className="text-center text-blue-200">Loading news...</p>
                    )}
                </ul>
            </div>
        </section>
    );
};