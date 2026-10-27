
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "shale_library",
    waitForConnections: true,
    connectionLimit: 10
});


// =============================
// HEALTH CHECK
// =============================

app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT DATABASE() AS databaseName"
        );

        res.json({
            message: "Backend connected successfully.",
            database: rows[0].databaseName
        });
    } catch (error) {
        console.error("Health check error:", error.message);
        res.status(500).json({
            message: "Database connection failed."
        });
    }
});


// =============================
// BOOKS
// =============================

// Get all books
app.get("/api/books", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM books ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error("Get books error:", error.message);
        res.status(500).json({
            message: "Could not load books."
        });
    }
});

// Add a book
app.post("/api/books", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;

        if (
            !title || !author || !genre || !isbn ||
            quantity === undefined || quantity === ""
        ) {
            return res.status(400).json({
                message: "Please provide all book details."
            });
        }

        const amount = Number(quantity);

        if (!Number.isInteger(amount) || amount < 0) {
            return res.status(400).json({
                message: "Quantity must be a whole number of zero or more."
            });
        }

        const [result] = await db.query(
            `INSERT INTO books (title, author, genre, isbn, quantity)
             VALUES (?, ?, ?, ?, ?)`,
            [title, author, genre, isbn, amount]
        );

        res.status(201).json({
            message: "Book added successfully.",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add book error:", error.message);
        res.status(500).json({
            message: "Could not add book."
        });
    }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
    try {
        const { title, author, genre, isbn, quantity } = req.body;
        const amount = Number(quantity);

        if (
            !title || !author || !genre || !isbn ||
            quantity === undefined || quantity === "" ||
            !Number.isInteger(amount) || amount < 0
        ) {
            return res.status(400).json({
                message: "Please provide valid book details."
            });
        }

        const [result] = await db.query(
            `UPDATE books
             SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ?
             WHERE id = ?`,
            [title, author, genre, isbn, amount, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        res.json({
            message: "Book updated successfully."
        });
    } catch (error) {
        console.error("Update book error:", error.message);
        res.status(500).json({
            message: "Could not update book."
        });
    }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM books WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        res.json({
            message: "Book deleted successfully."
        });
    } catch (error) {
        console.error("Delete book error:", error.message);
        res.status(500).json({
            message: "Could not delete book. It may have existing transactions."
        });
    }
});


// =============================
// MEMBERS
// =============================

// Get all members
app.get("/api/members", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM members ORDER BY id DESC"
        );
        res.json(rows);
    } catch (error) {
        console.error("Get members error:", error.message);
        res.status(500).json({
            message: "Could not load members."
        });
    }
});

// Add a member
app.post("/api/members", async (req, res) => {
    try {
        const { name, memberId, contact } = req.body;

        if (!name || !memberId || !contact) {
            return res.status(400).json({
                message: "Please provide the member's name, ID and contact."
            });
        }

        const [result] = await db.query(
            `INSERT INTO members (name, memberId, contact)
             VALUES (?, ?, ?)`,
            [name, memberId, contact]
        );

        res.status(201).json({
            message: "Member added successfully.",
            id: result.insertId
        });
    } catch (error) {
        console.error("Add member error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "That member ID already exists."
            });
        }

        res.status(500).json({
            message: "Could not add member."
        });
    }
});

// Update a member
app.put("/api/members/:id", async (req, res) => {
    try {
        const { name, memberId, contact } = req.body;

        if (!name || !memberId || !contact) {
            return res.status(400).json({
                message: "Please provide all member details."
            });
        }

        const [result] = await db.query(
            `UPDATE members
             SET name = ?, memberId = ?, contact = ?
             WHERE id = ?`,
            [name, memberId, contact, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Member not found."
            });
        }

        res.json({
            message: "Member updated successfully."
        });
    } catch (error) {
        console.error("Update member error:", error.message);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "That member ID already exists."
            });
        }

        res.status(500).json({
            message: "Could not update member."
        });
    }
});

// Delete a member
app.delete("/api/members/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM members WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Member not found."
            });
        }

        res.json({
            message: "Member deleted successfully."
        });
    } catch (error) {
        console.error("Delete member error:", error.message);
        res.status(500).json({
            message: "Could not delete member. The member may have existing transactions."
        });
    }
});


// =============================
// TRANSACTIONS
// One copy per transaction
// =============================

// Get all transactions
app.get("/api/transactions", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT
                t.id,
                t.book_id AS bookId,
                t.member_id AS memberId,
                b.title AS bookTitle,
                m.name AS memberName,
                t.status AS type,
                t.borrow_date AS borrowDate,
                t.return_date AS returnDate
             FROM borrow_transactions t
             INNER JOIN books b ON t.book_id = b.id
             INNER JOIN members m ON t.member_id = m.id
             ORDER BY t.id DESC`
        );

        res.json(rows);
    } catch (error) {
        console.error("Get transactions error:", error.message);
        res.status(500).json({
            message: "Could not load transactions.",
            error: error.message
        });
    }
});

// Record one borrowed or returned copy
app.post("/api/transactions", async (req, res) => {
    let connection;

    try {
        const { bookId, memberId, type } = req.body;

        if (
            !bookId ||
            !memberId ||
            !["Borrowed", "Returned"].includes(type)
        ) {
            return res.status(400).json({
                message: "Select a book, a member and a valid transaction type."
            });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // Find and lock the book
        const [books] = await connection.query(
            "SELECT id, quantity FROM books WHERE id = ? FOR UPDATE",
            [bookId]
        );

        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Book not found."
            });
        }

        const available = Number(books[0].quantity);

        // Check the member exists
        const [members] = await connection.query(
            "SELECT id FROM members WHERE id = ?",
            [memberId]
        );

        if (members.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                message: "Member not found."
            });
        }

        if (type === "Borrowed") {
            if (available < 1) {
                await connection.rollback();
                return res.status(400).json({
                    message: "No copies of this book are available."
                });
            }

            // Reduce available book stock by one
            await connection.query(
                "UPDATE books SET quantity = quantity - 1 WHERE id = ?",
                [bookId]
            );
        } else {
            // Count the copies this member still has outstanding
            const [outstandingRows] = await connection.query(
                `SELECT COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'Borrowed' THEN 1
                            WHEN status = 'Returned' THEN -1
                            ELSE 0
                        END
                    ), 0
                 ) AS outstanding
                 FROM borrow_transactions
                 WHERE book_id = ? AND member_id = ?`,
                [bookId, memberId]
            );

            const outstanding = Number(outstandingRows[0].outstanding);

            if (outstanding < 1) {
                await connection.rollback();
                return res.status(400).json({
                    message: "This member has no outstanding copy of this book to return."
                });
            }

            // Increase available book stock by one
            await connection.query(
                "UPDATE books SET quantity = quantity + 1 WHERE id = ?",
                [bookId]
            );
        }

        // Do not use the transaction-level quantity column
        await connection.query(
            `INSERT INTO borrow_transactions
                (book_id, member_id, borrow_date, return_date, status)
             VALUES (?, ?, CURDATE(), ?, ?)`,
            [
                bookId,
                memberId,
                type === "Returned" ? new Date() : null,
                type
            ]
        );

        await connection.commit();

        res.status(201).json({
            message: "Transaction recorded successfully."
        });
    } catch (error) {
        if (connection) {
            await connection.rollback().catch(() => {});
        }

        console.error("Record transaction error:", error.message);
        res.status(500).json({
            message: "Could not record transaction.",
            error: error.message
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


// =============================
// START SERVER
// =============================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
});
