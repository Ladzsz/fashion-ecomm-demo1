import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* -----------------------------
   Types
--------------------------------*/

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: Address;
  referral_source: string;
  referred_by_id: string | null;
  vip_status: boolean;
  communication_pref: string;
  notes: string;
}

interface CRMData {
  clients: Client[];
  [key: string]: unknown;
}

interface CreateClientProps {
  crmData: CRMData;
  updateCrmData: (data: CRMData) => void;
  onClose: () => void;
}

/* -----------------------------
   Component
--------------------------------*/

export default function CreateClient({
  crmData,
  updateCrmData,
  onClose,
}: CreateClientProps) {
  const [formData, setFormData] = useState<
    Omit<Client, "client_id">
  >({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    referral_source: "Other",
    referred_by_id: null,
    vip_status: false,
    communication_pref: "Email",
    notes: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (): void => {
    const duplicateEmail = crmData.clients.find(
      (c) => c.email === formData.email
    );
    const duplicatePhone = crmData.clients.find(
      (c) => c.phone === formData.phone
    );

    if (duplicateEmail || duplicatePhone) {
      setError("Duplicate email or phone detected!");
      return;
    }

    const newClient: Client = {
      ...formData,
      client_id: uuidv4(),
    };

    const newData: CRMData = {
      ...crmData,
      clients: [...crmData.clients, newClient],
    };

    updateCrmData(newData);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20%",
        left: "30%",
        background: "white",
        padding: "20px",
        border: "1px solid #ccc",
        zIndex: 1000,
      }}
    >
      <h3>Create Client</h3>

      <input
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      {/* Add more inputs for address, preferences, etc. */}

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleSubmit}
          className="btn-primary"
        >
          Create
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
}
