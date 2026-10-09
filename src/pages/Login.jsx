import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "Shale" && password === "Shale2006") {
      localStorage.setItem("loggedIn", "true");

      navigate("/dashboard");
    } else {
      alert("Incorrect Membership ID or password");
    }
  };

  return (
    <div className="login">

      <div className="login-box">

        <h2>Shale Library</h2>

        <p>Community Library Management System</p>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Membership ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}
export default Login;