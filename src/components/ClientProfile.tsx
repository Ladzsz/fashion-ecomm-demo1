import { useParams } from "react-router-dom";

/* -----------------------------
   Types
--------------------------------*/

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface Client {
  client_id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address: Address;
  communication_pref?: string;
  notes?: string;
  vip_status?: boolean;
  no_show_count?: number;
}

interface Measurement {
  client_id: string | number;
  [key: string]: unknown;
}

interface StylePreference {
  client_id: string | number;
  [key: string]: unknown;
}

interface Order {
  order_id: string;
  client_id: string | number;
  order_type: string;
  status: string;
  total_price: number;
}

interface Activity {
  activity_id: string;
  client_id: string | number;
  created_at: string;
  activity_type: string;
  subject: string;
}

interface Appointment {
  appointment_id: string;
  client_id: string | number;
  type: string;
  start_time: string;
  duration_minutes: number;
  status: string;
  notes?: string;
}

interface CRMData {
  clients: Client[];
  measurements: Measurement[];
  style_preferences: StylePreference[];
  orders: Order[];
  activities: Activity[];
  appointments?: Appointment[];
}

interface ClientProfileProps {
  crmData: CRMData;
  updateCrmData: (data: CRMData) => void;
}

/* -----------------------------
   Component
--------------------------------*/

export default function ClientProfile({
  crmData,
  updateCrmData,
}: ClientProfileProps) {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <p>Invalid client ID</p>;
  }

  const client = crmData.clients.find(
    (c) => String(c.client_id) === id
  );

  if (!client) return <p>Client not found</p>;

  const measurements =
    crmData.measurements.find(
      (m) => String(m.client_id) === id
    ) ?? {};

  const preferences =
    crmData.style_preferences.find(
      (p) => String(p.client_id) === id
    ) ?? {};

  const orders = crmData.orders.filter(
    (o) => String(o.client_id) === id
  );

  const activities = crmData.activities
    .filter((a) => String(a.client_id) === id)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

  const clientAppointments = (crmData.appointments ?? [])
    .filter((a) => String(a.client_id) === id)
    .sort((a, b) =>
      b.start_time.localeCompare(a.start_time)
    );

  const upcoming = clientAppointments.filter(
    (a) =>
      a.status === "Scheduled" &&
      new Date(a.start_time) > new Date()
  );

  return (
    <div className="card">
      <h2>
        {client.first_name} {client.last_name}{" "}
        {client.vip_status && (
          <span style={{ color: "#e91e63" }}>
            VIP
          </span>
        )}
      </h2>

      {/* Contact Info */}
      <section>
        <h3>Contact Info</h3>
        <p>Email: {client.email}</p>
        <p>Phone: {client.phone}</p>
        <p>
          Address:{" "}
          {Object.values(client.address)
            .filter(Boolean)
            .join(", ")}
        </p>
        <p>
          Communication Pref:{" "}
          {client.communication_pref}
        </p>
        <p>Notes: {client.notes}</p>
      </section>

      {/* Measurements */}
      <section>
        <h3>Measurements</h3>
        <table>
          <tbody>
            {Object.entries(measurements)
              .filter(([k]) => k !== "client_id")
              .map(([key, value]) => (
                <tr key={key}>
                  <td>{key.replace("_", " ")}</td>
                  <td>{String(value)} in</td>
                </tr>
              ))}
          </tbody>
        </table>

        <button
          onClick={() => {
            const newMeas = prompt(
              "Enter new chest measurement",
              String((measurements as any).chest ?? "")
            );
            if (newMeas) {
              const updated =
                crmData.measurements.map((m) =>
                  String(m.client_id) === id
                    ? {
                        ...m,
                        chest: Number(newMeas),
                      }
                    : m
                );
              updateCrmData({
                ...crmData,
                measurements: updated,
              });
            }
          }}
        >
          Edit Chest
        </button>
      </section>

      {/* Style Preferences */}
      <section>
        <h3>Style Preferences</h3>
        <ul>
          {Object.entries(preferences)
            .filter(([k]) => k !== "client_id")
            .map(([key, value]) => (
              <li key={key}>
                {key.replace("_", " ")}:{" "}
                {JSON.stringify(value)}
              </li>
            ))}
        </ul>
      </section>

      {/* Orders */}
      <section>
        <h3>Order History</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_type}</td>
                <td>{order.status}</td>
                <td>${order.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Activity */}
      <section>
        <h3>Activity Timeline</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.activity_id}>
              {activity.created_at}:{" "}
              {activity.activity_type} –{" "}
              {activity.subject}
            </li>
          ))}
        </ul>
      </section>

      {/* Upcoming Appointments */}
      <section>
        <h3>Upcoming Appointments</h3>
        {upcoming.length === 0 ? (
          <p>No upcoming appointments.</p>
        ) : (
          <ul>
            {upcoming.map((appt) => (
              <li key={appt.appointment_id}>
                {new Date(
                  appt.start_time
                ).toLocaleString()}{" "}
                – {appt.type} (
                {appt.duration_minutes} min)
                {appt.notes && (
                  <>
                    <br />
                    <em>{appt.notes}</em>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Appointment History */}
      <section>
        <h3>Appointment History</h3>
        <ul>
          {clientAppointments.map((appt) => (
            <li key={appt.appointment_id}>
              {new Date(
                appt.start_time
              ).toLocaleDateString()}{" "}
              – {appt.type} – Status:{" "}
              <strong>{appt.status}</strong>
            </li>
          ))}
        </ul>

        {client.no_show_count &&
          client.no_show_count > 2 && (
            <p style={{ color: "red" }}>
              Warning: Client has{" "}
              {client.no_show_count} no-shows.
            </p>
          )}
      </section>
    </div>
  );
}
