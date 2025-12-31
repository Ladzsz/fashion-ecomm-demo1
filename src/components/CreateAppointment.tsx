import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* -----------------------------
   Constants
--------------------------------*/

const appointmentTypes = [
  "Consultation",
  "Fitting",
  "Pickup",
] as const;

const durations: Record<
  (typeof appointmentTypes)[number],
  number
> = {
  Consultation: 60,
  Fitting: 30,
  Pickup: 15,
};

/* -----------------------------
   Types
--------------------------------*/

interface Client {
  client_id: string | number;
  first_name: string;
  last_name: string;
}

interface Appointment {
  appointment_id: string;
  client_id: string | number;
  type: (typeof appointmentTypes)[number];
  start_time: string;
  duration_minutes: number;
  status: string;
  notes?: string;
}

interface Activity {
  activity_id: string;
  client_id: string | number;
  created_at: string;
  activity_type: string;
  subject: string;
}

interface CRMData {
  clients: Client[];
  appointments?: Appointment[];
  activities?: Activity[];
  [key: string]: unknown;
}

interface CreateAppointmentProps {
  crmData: CRMData;
  updateCrmData: (data: CRMData) => void;
  onClose: () => void;
  editingAppointment?: Appointment | null;
}

interface AppointmentFormData {
  client_id: string | number | "";
  type: (typeof appointmentTypes)[number];
  start_time: string;
  notes: string;
}

/* -----------------------------
   Component
--------------------------------*/

export default function CreateAppointment({
  crmData,
  updateCrmData,
  onClose,
  editingAppointment = null,
}: CreateAppointmentProps) {
  const isEdit = Boolean(editingAppointment);

  const [formData, setFormData] =
    useState<AppointmentFormData>({
      client_id: editingAppointment?.client_id ?? "",
      type: editingAppointment?.type ?? "Consultation",
      start_time: editingAppointment
        ? editingAppointment.start_time.slice(0, 16) // datetime-local
        : "",
      notes: editingAppointment?.notes ?? "",
    });

  const [error, setError] = useState<string>("");

  /* -----------------------------
     Handlers
  --------------------------------*/

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isBusinessHours = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 = Sun, 6 = Sat
    if (day === 0 || day === 6) return false;

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return (
      hours >= 10 &&
      (hours < 18 || (hours === 18 && minutes <= 30))
    );
  };

  const hasOverlap = (
    startStr: string,
    durationMin: number,
    ignoreId: string | null = null
  ): boolean => {
    const newStart = new Date(startStr);
    const newEnd = new Date(
      newStart.getTime() + durationMin * 60000
    );

    return (crmData.appointments ?? []).some((appt) => {
      if (appt.appointment_id === ignoreId)
        return false;

      const existingStart = new Date(
        appt.start_time
      );
      const existingEnd = new Date(
        existingStart.getTime() +
          appt.duration_minutes * 60000
      );

      return (
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });
  };

  const handleSubmit = (): void => {
    setError("");

    if (
      !formData.client_id ||
      !formData.type ||
      !formData.start_time
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!isBusinessHours(formData.start_time)) {
      setError(
        "Appointments only available Mon–Fri, 10:00 AM – 6:30 PM."
      );
      return;
    }

    const duration = durations[formData.type];
    const ignoreId = isEdit
      ? editingAppointment!.appointment_id
      : null;

    if (
      hasOverlap(
        formData.start_time,
        duration,
        ignoreId
      )
    ) {
      setError(
        "This time conflicts with an existing appointment."
      );
      return;
    }

    const appointmentData: Appointment = {
      appointment_id: isEdit
        ? editingAppointment!.appointment_id
        : uuidv4(),
      client_id: formData.client_id,
      type: formData.type,
      start_time: new Date(
        formData.start_time
      ).toISOString(),
      duration_minutes: duration,
      status: isEdit
        ? editingAppointment!.status
        : "Scheduled",
      notes: formData.notes,
    };

    let newAppointments = crmData.appointments ?? [];

    newAppointments = isEdit
      ? newAppointments.map((a) =>
          a.appointment_id ===
          appointmentData.appointment_id
            ? appointmentData
            : a
        )
      : [...newAppointments, appointmentData];

    let newData: CRMData = {
      ...crmData,
      appointments: newAppointments,
    };

    if (!isEdit) {
      const newActivity: Activity = {
        activity_id: uuidv4(),
        client_id: formData.client_id,
        created_at: new Date().toISOString(),
        activity_type: "Appointment Scheduled",
        subject: `${formData.type} on ${new Date(
          formData.start_time
        ).toLocaleString()}`,
      };

      newData = {
        ...newData,
        activities: [
          ...(crmData.activities ?? []),
          newActivity,
        ],
      };
    }

    updateCrmData(newData);
    onClose();
  };

  /* -----------------------------
     Render
  --------------------------------*/

  return (
    <div
      style={{
        position: "fixed",
        top: "15%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow:
          "0 10px 40px rgba(0,0,0,0.2)",
        zIndex: 1000,
        width: "400px",
      }}
    >
      <h3>{isEdit ? "Edit" : "New"} Appointment</h3>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="client-select">Client</label>
        <select
          id="client-select"
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        >
          <option value="">Select Client</option>
          {crmData.clients.map((c) => (
            <option
              key={c.client_id}
              value={c.client_id}
            >
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="type-select">
          Type (Duration)
        </label>
        <select
          id="type-select"
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        >
          {appointmentTypes.map((t) => (
            <option key={t} value={t}>
              {t} ({durations[t]} min)
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="datetime-input">
          Date & Time
        </label>
        <input
          id="datetime-input"
          type="datetime-local"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="notes-textarea">
          Notes (optional)
        </label>
        <textarea
          id="notes-textarea"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
            height: "80px",
          }}
        />
      </div>

      {error && (
        <p style={{ color: "red", margin: "10px 0" }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleSubmit}
          className="btn-primary"
        >
          {isEdit ? "Save Changes" : "Schedule"}
        </button>
        <button
          onClick={onClose}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
