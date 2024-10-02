import React, { useState, useEffect } from 'react';

export const News = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 5;

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

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = news.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="relative z-10 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-5xl font-bold mb-8 text-white text-center tracking-wide">
                    Landsat News
                </h1>
                <ul className="space-y-4">
                    {currentArticles.length > 0 ? (
                        currentArticles.map((article) => (
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
                <div className="flex justify-center mt-8">
                    {Array.from({ length: Math.ceil(news.length / articlesPerPage) }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};