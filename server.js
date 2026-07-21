const express = require('express');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key';

app.use(express.json());
app.use(cors());
app.use(session({ secret: SECRET_KEY, resave: false, saveUninitialized: true }));

const books = [
    { "isbn": "978-3-16-148410-0", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925, "publisher": "Scribner", "price": 12.99 },
    { "isbn": "978-0-7432-7356-5", "title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960, "publisher": "J.B. Lippincott & Co.", "price": 14.99 },
    { "isbn": "978-0-452-28423-4", "title": "1984", "author": "George Orwell", "year": 1949, "publisher": "Secker & Warburg", "price": 13.99 },
    { "isbn": "978-0-14-143951-8", "title": "Pride and Prejudice", "author": "Jane Austen", "year": 1813, "publisher": "Penguin Books", "price": 11.99 }
];

const reviews = {};

// GET all books
app.get('/', (req, res) => res.json(books));

// GET by ISBN
app.get('/isbn/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).json({ message: 'Book not found' });
});

// GET by Author
app.get('/author/:author', (req, res) => {
    const author = decodeURIComponent(req.params.author);
    res.json(books.filter(b => b.author.toLowerCase().includes(author.toLowerCase())));
});

// GET by Title
app.get('/title/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title);
    res.json(books.filter(b => b.title.toLowerCase().includes(title.toLowerCase())));
});

// GET review by ISBN
app.get('/', (req, res) => {
  const booksWithReviews = books.map(book => ({
    ...book,
    reviews: reviews[book.isbn] || []
  }));
  res.json(booksWithReviews);
});

// POST register
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    req.session.user = { username, password };
    res.json({ message: 'User registered successfully!', username });
});

// POST login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
    if (req.session.user && req.session.user.username === username) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful!', username, token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Middleware auth
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    try {
        req.user = jwt.verify(authHeader.split(' ')[1], SECRET_KEY);
        next();
    } catch { res.status(401).json({ message: 'Invalid token' }); }
};

// POST review
app.post('/review/:isbn', authenticate, (req, res) => {
    const { rating, comment } = req.body;
    const isbn = req.params.isbn;
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' });
    if (!reviews[isbn]) reviews[isbn] = [];
    const existing = reviews[isbn].findIndex(r => r.user === req.user.username);
    const newReview = { user: req.user.username, rating, comment, date: new Date().toISOString() };
    if (existing !== -1) {
        reviews[isbn][existing] = newReview;
        res.json({ message: 'Review updated successfully!', reviews: reviews[isbn] });
    } else {
        reviews[isbn].push(newReview);
        res.json({ message: 'Review added successfully!', reviews: reviews[isbn] });
    }
});

// DELETE review
app.delete('/review/:isbn', authenticate, (req, res) => {
    const isbn = req.params.isbn;
    if (!reviews[isbn]) return res.status(404).json({ message: 'No reviews found' });
    const initial = reviews[isbn].length;
    reviews[isbn] = reviews[isbn].filter(r => r.user !== req.user.username);
    reviews[isbn].length < initial
        ? res.json({ message: 'Review deleted successfully!', reviews: reviews[isbn] })
        : res.status(404).json({ message: 'Review not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
