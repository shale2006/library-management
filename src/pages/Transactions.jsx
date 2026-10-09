import { useState } from "react";

function Transactions() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [type, setType] = useState("Borrowed");
  const [quantity, setQuantity] = useState(1);

  const recordTransaction = (e) => {
    e.preventDefault();

    if (!selectedBook || !quantity) {
      alert("Please fill in all fields");
      return;
    }

    const book = books.find(
      (book) => book.id === Number(selectedBook)
    );

    const transactionQuantity = Number(quantity);

    if (!book) {
      alert("Please select a book");
      return;
    }

    if (
      type === "Borrowed" &&
      transactionQuantity > Number(book.quantity)
    ) {
      alert("Not enough books available");
      return;
    }

    let updatedBooks;

    if (type === "Borrowed") {
      updatedBooks = books.map((item) =>
        item.id === book.id
          ? {
              ...item,
              quantity:
                Number(item.quantity) - transactionQuantity,
            }
          : item
      );
    } else {
      updatedBooks = books.map((item) =>
        item.id === book.id
          ? {
              ...item,
              quantity:
                Number(item.quantity) + transactionQuantity,
            }
          : item
      );
    }

    setBooks(updatedBooks);

    localStorage.setItem(
      "books",
      JSON.stringify(updatedBooks)
    );

    const newTransaction = {
      id: Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      type: type,
      quantity: transactionQuantity,
      date: new Date().toLocaleString(),
    };

    const updatedTransactions = [
      ...transactions,
      newTransaction,
    ];

    setTransactions(updatedTransactions);

    localStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );

    setSelectedBook("");
    setType("Borrowed");
    setQuantity(1);
    setShowForm(false);
  };

  return (
    <div className="page">

      <div className="library-header">
        <h1>Community Library</h1>
        <p>Library Management System</p>
      </div>

      <div className="transactions-card">

        <h2>Transactions</h2>

        <button
          className="record-transaction-button"
          onClick={() => setShowForm(!showForm)}
        >
          Record Transaction
        </button>

        {showForm && (
          <form
            className="transaction-form"
            onSubmit={recordTransaction}
          >

            <select
              value={selectedBook}
              onChange={(e) =>
                setSelectedBook(e.target.value)
              }
            >
              <option value="">Select Book</option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
            </select>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
            />

            <button type="submit">
              Save Transaction
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </form>
        )}

        <div className="transaction-table-container">

          <table className="transaction-table">

            <thead>
              <tr>
                <th>Book</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    No transactions available.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>

                    <td>{transaction.bookTitle}</td>

                    <td>{transaction.type}</td>

                    <td>{transaction.quantity}</td>

                    <td>{transaction.date}</td>

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

export default Transactions;