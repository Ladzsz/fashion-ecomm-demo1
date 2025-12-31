import { useState } from "react";

/* -----------------------------
   Types
--------------------------------*/

interface Client {
  client_id: number;
  first_name: string;
  last_name: string;
  notes?: string;
  referred_by_id?: number | null;
}

interface Measurement {
  client_id: number;
  [key: string]: unknown;
}

interface StylePreference {
  client_id: number;
  [key: string]: unknown;
}

interface Order {
  client_id: number;
  [key: string]: unknown;
}

interface Activity {
  client_id: number;
  [key: string]: unknown;
}

interface CRMData {
  clients: Client[];
  measurements: Measurement[];
  style_preferences: StylePreference[];
  orders: Order[];
  activities: Activity[];
}

interface MergeClientsProps {
  crmData: CRMData;
  updateCrmData: (data: CRMData) => void;
  onClose: () => void;
}

/* -----------------------------
   Component
--------------------------------*/

export default function MergeClients({
  crmData,
  updateCrmData,
  onClose,
}: MergeClientsProps) {
  const [client1Id, setClient1Id] = useState<number | null>(null);
  const [client2Id, setClient2Id] = useState<number | null>(null);

  const handleMerge = (): void => {
    if (client1Id == null || client2Id == null) return;

    const client1 = crmData.clients.find(
      (c) => c.client_id === client1Id
    );
    const client2 = crmData.clients.find(
      (c) => c.client_id === client2Id
    );

    if (!client1 || !client2) return;

    // Merge notes
    const mergedClient: Client = {
      ...client1,
      notes: `${client1.notes ?? ""}\nMerged from ${
        client2.first_name
      } ${client2.last_name}: ${client2.notes ?? ""}`,
    };

    // Remove client2
    const newClients = crmData.clients
      .filter((c) => c.client_id !== client2Id)
      .map((c) =>
        c.referred_by_id === client2Id
          ? { ...c, referred_by_id: client1Id }
          : c
      )
      .map((c) =>
        c.client_id === client1Id ? mergedClient : c
      );

    // Merge measurements
    const client2Measurement = crmData.measurements.find(
      (m) => m.client_id === client2Id
    );

    const newMeasurements = [
      ...crmData.measurements.filter(
        (m) => m.client_id !== client2Id
      ),
      ...(client2Measurement
        ? [{ ...client2Measurement, client_id: client1Id }]
        : []),
    ];

    // Merge style preferences
    const client2Preference =
      crmData.style_preferences.find(
        (p) => p.client_id === client2Id
      );

    const newPreferences = [
      ...crmData.style_preferences.filter(
        (p) => p.client_id !== client2Id
      ),
      ...(client2Preference
        ? [{ ...client2Preference, client_id: client1Id }]
        : []),
    ];

    // Merge orders
    const newOrders = [
      ...crmData.orders.filter(
        (o) => o.client_id !== client2Id
      ),
      ...crmData.orders
        .filter((o) => o.client_id === client2Id)
        .map((o) => ({
          ...o,
          client_id: client1Id,
        })),
    ];

    // Merge activities
    const newActivities = [
      ...crmData.activities.filter(
        (a) => a.client_id !== client2Id
      ),
      ...crmData.activities
        .filter((a) => a.client_id === client2Id)
        .map((a) => ({
          ...a,
          client_id: client1Id,
        })),
    ];

    const newData: CRMData = {
      ...crmData,
      clients: newClients,
      measurements: newMeasurements,
      style_preferences: newPreferences,
      orders: newOrders,
      activities: newActivities,
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
      <h3>Merge Clients</h3>

      <select
        value={client1Id ?? ""}
        onChange={(e) =>
          setClient1Id(
            e.target.value
              ? Number(e.target.value)
              : null
          )
        }
      >
        <option value="">
          Select Client 1 (Keep)
        </option>
        {crmData.clients.map((c) => (
          <option
            key={c.client_id}
            value={c.client_id}
          >
            {c.first_name} {c.last_name}
          </option>
        ))}
      </select>

      <select
        value={client2Id ?? ""}
        onChange={(e) =>
          setClient2Id(
            e.target.value
              ? Number(e.target.value)
              : null
          )
        }
      >
        <option value="">
          Select Client 2 (Merge Into 1)
        </option>
        {crmData.clients.map((c) => (
          <option
            key={c.client_id}
            value={c.client_id}
          >
            {c.first_name} {c.last_name}
          </option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleMerge}
          className="btn-primary"
        >
          Merge
        </button>
        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
