
import { useEffect, useState } from "react";

const BOOKS_API = "http://localhost:5001/api/books";
const MEMBERS_API = "http://localhost:5001/api/members";
const TRANSACTIONS_API = "http://localhost:5001/api/transactions";

function Transactions() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [type, setType] = useState("Borrowed");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [booksResponse, membersResponse, transactionsResponse] =
        await Promise.all([
          fetch(BOOKS_API),
          fetch(MEMBERS_API),
          fetch(TRANSACTIONS_API),
        ]);

      if (
        !booksResponse.ok ||
        !membersResponse.ok ||
        !transactionsResponse.ok
      ) {
        throw new Error("Could not load library data.");
      }

      const [booksData, membersData, transactionsData] = await Promise.all([
        booksResponse.json(),
        membersResponse.json(),
        transactionsResponse.json(),
      ]);

      setBooks(booksData);
      setMembers(membersData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const recordTransaction = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedBook || !selectedMember) {
      setError("Please select both a book and a member.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(TRANSACTIONS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: Number(selectedBook),
          memberId: Number(selectedMember),
          type,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Transaction failed.");
      }

      setSelectedBook("");
      setSelectedMember("");
      setType("Borrowed");
      setShowForm(false);

      await loadData();

      alert("Transaction recorded successfully!");
    } catch (err) {
      setError(err.message || "Could not save transaction.");
    } finally {
      setSaving(false);
    }
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
          onClick={() => {
            setError("");
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel Transaction" : "Record Transaction"}
        </button>

        {error && (
          <p
            role="alert"
            style={{ color: "red", marginTop: "12px" }}
          >
            {error}
          </p>
        )}

        {showForm && (
          <form className="transaction-form" onSubmit={recordTransaction}>
            <label>Select Book</label>

            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              required
            >
              <option value="">Select Book</option>

              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — Available: {book.quantity}
                </option>
              ))}
            </select>

            <label>Select Member</label>

            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              required
            >
              <option value="">Select Member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.memberId})
                </option>
              ))}
            </select>

            <label>Transaction Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Borrowed">Borrowed</option>
              <option value="Returned">Returned</option>
            </select>

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Transaction"}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError("");
              }}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="transaction-table-container">
          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4">No transactions available.</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.bookTitle}</td>
                      <td>{transaction.memberName}</td>
                      <td>{transaction.type}</td>
                      <td>
                        {transaction.type === "Returned"
                          ? transaction.returnDate
                          : transaction.borrowDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Transactions;
