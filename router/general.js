const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

async function getAllBooks() {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function getBookReview(isbn) {
    try {
        const response = await axios.get(`${BASE_URL}/review/${isbn}`);
        return response.data;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function registerUser(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function loginUser(username, password) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function addReview(isbn, token, rating, comment) {
    try {
        const response = await axios.post(
            `${BASE_URL}/review/${isbn}`,
            { rating, comment },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function deleteReview(isbn, token) {
    try {
        const response = await axios.delete(
            `${BASE_URL}/review/${isbn}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle,
    getBookReview,
    registerUser,
    loginUser,
    addReview,
    deleteReview
};
