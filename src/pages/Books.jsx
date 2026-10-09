import { useState, useEffect } from "react";

function Books() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  const clearForm = () => {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setEditingId(null);
    setShowForm(false);
  };

  const saveBook = (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      setBooks(
        books.map((book) =>
          book.id === editingId
            ? {
                ...book,
                title,
                author,
                genre,
                isbn,
                quantity,
              }
            : book
        )
      );
    } else {
      const newBook = {
        id: Date.now(),
        title,
        author,
        genre,
        isbn,
        quantity,
      };

      setBooks([...books, newBook]);
    }

    clearForm();
  };

  const editBook = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setShowForm(true);
  };

  const deleteBook = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      setBooks(books.filter((book) => book.id !== id));
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
            />

            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />

            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />

            <input
              type="text"
              placeholder="ISBN"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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

              {books.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No books available.
                  </td>
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