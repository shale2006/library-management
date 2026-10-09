import { useState } from "react";

function Dashboard() {
  const [books] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [members] = useState(() => {
    const savedMembers = localStorage.getItem("members");
    return savedMembers ? JSON.parse(savedMembers) : [];
  });

  const [transactions] = useState(() => {
    const savedTransactions = localStorage.getItem("transactions");
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  return (
    <div className="dashboard">

      <div className="library-header">
        <h1>Community Library</h1>
        <p>Library Management System</p>
      </div>

      <div className="dashboard-card">

        <h2>Dashboard</h2>

        <div className="stats">

          <div className="stat-card">
            <h3>Books</h3>
            <p>{books.length}</p>
          </div>

          <div className="stat-card">
            <h3>Members</h3>
            <p>{members.length}</p>
          </div>

          <div className="stat-card">
            <h3>Transactions</h3>
            <p>{transactions.length}</p>
          </div>

        </div>

        <div className="welcome">
          <h2>Welcome</h2>
          <p>
            Welcome to the Community Library Management System.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;