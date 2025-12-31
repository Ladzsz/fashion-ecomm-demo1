import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { initialCrmData } from "../data/crmData";

/* -----------------------------
   Types
--------------------------------*/

interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
}

interface Fabric {
  fabric_id: number;
  name: string;
}

interface Measurement {
  client_id: number;
  [key: string]: unknown;
}

interface Order {
  client_id: string | number;
  order_type: string;
  status: string;
  fabric_id: string | number | null;
  specificationsString: string;
  total_price: number;
  deposit_paid: number;
  balance_due: number;
  financing_type: string;
  due_date: string;
  event_date: string;
  photosString: string;
  measurements: Record<string, unknown>;
}

interface CRMData {
  clients: Client[];
  orders: any[];
  fabrics?: Fabric[];
  measurements?: Measurement[];
}

interface OrderWizardProps {
  crmData: CRMData;
  updateCrmData: (data: CRMData) => void;
  onClose: () => void;
}

/* -----------------------------
   Constants
--------------------------------*/

const steps = [
  "Client & Type",
  "Measurements Snapshot",
  "Fabric, Specs & Details",
  "Pricing & Photos",
];

/* -----------------------------
   Component
--------------------------------*/

export default function OrderWizard({
  crmData,
  updateCrmData,
  onClose,
}: OrderWizardProps) {
  const [step, setStep] = useState<number>(0);
  const [order, setOrder] = useState<Order>({
    client_id: "",
    order_type: "",
    status: "Consultation",
    fabric_id: "",
    specificationsString: "{}",
    total_price: 0,
    deposit_paid: 0,
    balance_due: 0,
    financing_type: "None",
    due_date: "",
    event_date: "",
    photosString: "",
    measurements: {},
  });

  const [error, setError] = useState<string>("");
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    console.log("Order state re-rendered with:", {
      client_id: order.client_id,
      order_type: order.order_type,
    });
  }, [order]);

  /* -----------------------------
     Unified change handler
  --------------------------------*/

  const handleChange = (
    field: keyof Order,
    value: string
  ): void => {
    setOrder((prev) => ({
      ...prev,
      [field]:
        field === "total_price" || field === "deposit_paid"
          ? Number(value) || 0
          : value,
    }));
  };

  /* -----------------------------
     Navigation
  --------------------------------*/

  const nextStep = (): void => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const prevStep = (): void => setStep((s) => s - 1);

  const validateStep = (): boolean => {
    setError("");
    if (step === 0 && (!order.client_id || !order.order_type)) {
      setError("Select client and order type.");
      return false;
    }
    return true;
  };

  /* -----------------------------
     Save
  --------------------------------*/

  const handleSave = (): void => {
    setError("");

    let specifications: Record<string, unknown> = {};
    try {
      specifications = JSON.parse(order.specificationsString || "{}");
    } catch {
      setError("Invalid JSON in specifications.");
      return;
    }

    if (!order.client_id || !order.order_type || order.total_price <= 0) {
      setError("Missing required fields: client, type, or price.");
      return;
    }

    const newOrder = {
      ...order,
      order_id: uuidv4(),
      fabric_id: order.fabric_id || null,
      specifications,
      balance_due: order.total_price - order.deposit_paid,
      due_date:
        order.due_date ||
        new Date().toISOString().split("T")[0],
      photos: order.photosString
        ? order.photosString
            .split(",")
            .map((url) => url.trim())
        : [],
    };

    const newData: CRMData = {
      ...crmData,
      orders: [...crmData.orders, newOrder],
    };

    updateCrmData(newData);

    if (order.status === "First Fitting") {
      setNotification("Notification: Order ready for fitting!");
    } else if (order.status === "Ready") {
      setNotification("Notification: Order ready for pickup!");
    }

    onClose();
  };

  /* -----------------------------
     Measurements snapshot
  --------------------------------*/

  const snapshotMeasurements = (): void => {
    const clientMeasurements =
      crmData.measurements?.find(
        (m) => m.client_id === Number(order.client_id)
      ) || {};

    setOrder((prev) => ({
      ...prev,
      measurements: { ...clientMeasurements },
    }));

    alert("Measurements snapshot taken!");
  };

  /* -----------------------------
     Safety & data prep
  --------------------------------*/

  if (!crmData) {
    return <div className="card">Loading...</div>;
  }

  const clients = Array.isArray(crmData.clients)
    ? crmData.clients
    : [];

  const fabrics = Array.isArray(crmData.fabrics)
    ? crmData.fabrics
    : initialCrmData.fabrics ?? [];

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
    background: "white",
    cursor: "pointer",
  };

  /* -----------------------------
     Render
  --------------------------------*/

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          position: "relative",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "12px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <h3>
          Create Order – Step {step + 1}: {steps[step]}
        </h3>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {notification && (
          <p style={{ color: "green" }}>{notification}</p>
        )}
      </div>
    </div>
  );
}
