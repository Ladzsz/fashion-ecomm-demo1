import { useState } from "react";

interface User {
  email: string;
  credits?: number;
  [key: string]: unknown;
}

interface ReferralProps {
  user: User;
  setUser: (user: User) => void;
}

export default function Referral({
  user,
  setUser,
}: ReferralProps) {
  const [code] = useState<string>(
    `REF-${user.email.split("@")[0]}`
  );
  const [credits, setCredits] = useState<number>(
    user.credits ?? 0
  );

  const simulateReferral = (): void => {
    const newCredits = credits + 5;
    const updatedUser: User = {
      ...user,
      credits: newCredits,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setCredits(newCredits);
  };

  return (
    <div>
      <h2>Referral System</h2>
      <p>Share your code with friends to earn credits!</p>
      <p>Your Referral Code: {code}</p>
      <p>Current Credits: {credits}</p>
      <button onClick={simulateReferral}>
        Simulate Friend Referral (Demo)
      </button>
    </div>
  );
}
