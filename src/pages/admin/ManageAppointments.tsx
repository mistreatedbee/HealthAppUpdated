import { useEffect, useState } from "react";
import { CalendarIcon, ClockIcon, VideoIcon } from "lucide-react";
import { appointmentAPI, doctorAPI, patientAPI } from "../../services/api";
import { Appointment, Doctor, Patient } from "../../types";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Record<string, Doctor>>({});
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await appointmentAPI.getAll() as Appointment[] | { appointments: Appointment[] };

        // ✅ Normalize response
        const appts = Array.isArray(response) ? response : response.appointments || [];

        setAppointments(
          appts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );

        const doctorMap: Record<string, Doctor> = {};
        const patientMap: Record<string, Patient> = {};

        for (const apt of appts) {
          // ✅ Handle doctor object or ID
          if (typeof apt.doctorId === "object") {
            const doc = apt.doctorId as Doctor;
            doctorMap[doc._id] = doc;
          } else if (!doctorMap[apt.doctorId]) {
            doctorMap[apt.doctorId] = await doctorAPI.getById(apt.doctorId);
          }

          // ✅ Handle patient object or ID
          if (typeof apt.patientId === "object") {
            const pat = apt.patientId as Patient;
            patientMap[pat._id] = pat;
          } else if (!patientMap[apt.patientId]) {
            patientMap[apt.patientId] = await patientAPI.getById(apt.patientId);
          }
        }

        setDoctors(doctorMap);
        setPatients(patientMap);

      } catch (err) {
        console.error("Failed to load appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <p className="mt-8 text-center text-gray-500">Loading appointments...</p>;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning" | "danger"> = {
      pending: "warning",
      approved: "success",
      declined: "danger",
      completed: "default",
      cancelled: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Appointments</h1>
        <p className="text-gray-600 mt-1">View all scheduled patient appointments</p>
      </div>

      <Card className="p-6 space-y-4">
        {appointments.map((appointment) => {
          const doctor =
            typeof appointment.doctorId === "object"
              ? (appointment.doctorId as Doctor)
              : doctors[appointment.doctorId];

          const patient =
            typeof appointment.patientId === "object"
              ? (appointment.patientId as Patient)
              : patients[appointment.patientId];

          return (
            <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {patient?.firstName} {patient?.lastName} → Dr. {doctor?.firstName} {doctor?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{doctor?.specialty}</p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(appointment.status)}
                  {appointment.type === "online" && (
                    <Badge variant="info">
                      <VideoIcon className="w-3 h-3 inline mr-1" /> Online
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {new Date(appointment.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  {appointment.time}
                </div>

                <div>{doctor?.city}, {doctor?.province}</div>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {appointment.reason}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
