import React, { useState } from "react";

const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/stage/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User ID:", data.id);
      // Here you can save the user ID or do something else with it
    } else {
      console.error("Login failed:", response.status, response.statusText);
    }
  };

  const handleAuthorize = async (event: React.MouseEvent) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/stage/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Authorized:", data);
    } else {
      console.error("Authorize failed:", response.status, response.statusText);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          email:
          <input
            type="text"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>

      <button onClick={handleAuthorize} type="button">
        Send Authorize
      </button>
    </div>
  );
};

export default Login;
