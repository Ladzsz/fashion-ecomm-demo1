import { useState } from "react";

interface User {
  email: string;
  password: string;
  role: "customer";
  credits: number;
}

interface RegisterProps {
  onRegister: (user: User) => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ): void => {
    e.preventDefault();

    if (localStorage.getItem("user")) {
      setError("User already exists in demo. Logout first.");
      return;
    }

    const newUser: User = {
      email,
      password,
      role: "customer",
      credits: referralCode ? 10 : 0,
    };

    onRegister(newUser);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

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

      <input
        type="text"
        placeholder="Referral Code (optional)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />

      <button type="submit">Register</button>

      {error && <p>{error}</p>}
    </form>
  );
}
