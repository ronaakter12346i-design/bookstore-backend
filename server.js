const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('Online Bookstore API is running...');
});

// --- USER AUTHENTICATION ROUTES ---

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// 2. User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// --- BOOKS ROUTES ---

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Add a book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, price, stock, category_id } = req.body;
        const newBook = await pool.query(
            'INSERT INTO books (title, author, price, stock, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, author, price, stock, category_id]
        );
        res.json(newBook.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get a single book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

        if (book.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json(book.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update a book by ID
app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price, stock, category_id } = req.body;
        const updateBook = await pool.query(
            'UPDATE books SET title = $1, author = $2, price = $3, stock = $4, category_id = $5 WHERE id = $6 RETURNING *',
            [title, author, price, stock, category_id, id]
        );

        if (updateBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book updated successfully", book: updateBook.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a book by ID
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBook = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

        if (deleteBook.rows.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// --- CATEGORIES ROUTES ---

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Add a category
app.post('/api/categories', async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await pool.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.json(newCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Update a category by ID
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updateCategory = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );

        if (updateCategory.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category updated successfully", category: updateCategory.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Delete a category by ID
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCategory = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

        if (deleteCategory.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});