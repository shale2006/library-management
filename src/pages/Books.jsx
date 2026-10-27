
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5001/api/books";

function Books() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load books from MySQL through the backend
  const loadBooks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error loading books:", error);
      alert("Could not load books. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
    setShowForm(false);
  };

  // Add or update a book in MySQL
  const saveBook = async (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !author.trim() ||
      !genre.trim() ||
      !isbn.trim() ||
      quantity === "" ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 0
    ) {
      alert("Please fill in all fields with a valid quantity");
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      isbn: isbn.trim(),
      quantity: Number(quantity),
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save book");
      }

      await loadBooks();
      clearForm();
      alert(editingId ? "Book updated successfully!" : "Book added successfully!");
    } catch (error) {
      console.error("Error saving book:", error);
      alert(error.message || "Could not save book");
    }
  };

  const editBook = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre || "");
    setIsbn(book.isbn || "");
    setQuantity(String(book.quantity));
    setShowForm(true);
  };

  // Delete a book from MySQL
  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not delete book");
      }

      await loadBooks();
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.message || "Could not delete book");
    }
  };

  return (
    <div className="page">
      <div className="library-header">
        <h1>Community Library</h1>
        <p>Library Management System</p>
      </div>

      <div className="books-card">
        <h2>Books</h2>

        <button
          className="add-book-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add New Book
        </button>

        {showForm && (
          <form className="book-form" onSubmit={saveBook}>
            <input
              type="text"
              placeholder="Book Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              step="1"
              required
            />

            <button type="submit">
              {editingId ? "Update Book" : "Save Book"}
            </button>

            <button type="button" onClick={clearForm}>
              Cancel
            </button>
          </form>
        )}

        <div className="book-table-container">
          <table className="book-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading books...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="7">No books available.</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      {Number(book.quantity) > 0
                        ? "Available"
                        : "Out of Stock"}
                    </td>
                    <td>
                      <button onClick={() => editBook(book)}>
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Books;
