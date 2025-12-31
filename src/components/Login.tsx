import { useState } from "react";

/* -----------------------------
   Types
--------------------------------*/

interface User {
  email: string;
  password: string;
  role: "admin" | "customer";
  credits?: number;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

/* -----------------------------
   Demo admin credentials
--------------------------------*/

const adminCredentials: User = {
  email: "admin@example.com",
  password: "adminpass",
  role: "admin",
};

/* -----------------------------
   Component
--------------------------------*/

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser) as User;
      if (
        parsed.email === email &&
        parsed.password === password
      ) {
        onLogin(parsed);
        return;
      }
    }

    // Check for admin
    if (
      email === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      onLogin(adminCredentials);
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {error && <p>{error}</p>}
    </form>
  );
}
