import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Forms from "./pages/Forms";
import Transactions from "./pages/Transactions";

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn");

  if (loggedIn !== "true") {
    return <Navigate to="/" />;
  }

  return children;
}

function Layout() {
  const location = useLocation();

  // Do not show the sidebar on the login page
  if (location.pathname === "/") {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="app">

      <nav className="sidebar">

        <h2>Shale Library</h2>

        <p>Community Library</p>

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/books">Books</Link>

        <Link to="/transactions">Transactions</Link>

        <Link to="/members">Members</Link>

        <Link to="/forms">Forms</Link>
        <button
  onClick={() => {
    localStorage.removeItem("loggedIn");
    window.location.href = "/";
  }}
>
  Logout
</button>

      </nav>

      <main className="content">

        <Routes>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Books />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Members />
              </ProtectedRoute>
            }
          />

          <Route
            path="/forms"
            element={
              <ProtectedRoute>
                <Forms />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>

      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;