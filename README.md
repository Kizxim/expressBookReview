# Express Book Review API

A RESTful API for managing book reviews built with Express.js.

## Features
- Get all books, by ISBN, author, or title
- User registration and login with JWT
- Add, update, and delete book reviews
- Authentication required for review operations

## API Endpoints

### Public Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| GET | `/isbn/:isbn` | Get book by ISBN |
| GET | `/author/:author` | Get books by author |
| GET | `/title/:title` | Get books by title |
| GET | `/review/:isbn` | Get reviews for a book |
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |

### Authenticated Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/review/:isbn` | Add or update a review |
| DELETE | `/review/:isbn` | Delete your review |

## Technologies
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Axios
- Express Session
