import React, { useEffect, useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Patient } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function ManagePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const allPatients = await adminAPI.getAllPatients(); // ✅ Await API
      setPatients(allPatients);
    } catch (err) {
      console.log("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patientId: string, patientName: string) => {
    if (confirm(`Are you sure you want to delete ${patientName}'s account? This cannot be undone.`)) {
      await adminAPI.deleteUser(patientId); // ✅ Await delete call
      loadPatients();
    }
  };

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Patients</h1>
        <p className="text-gray-600 mt-1">View and manage patient accounts</p>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{patient.firstName} {patient.lastName}</td>
                  <td className="py-3 px-4 text-gray-600">{patient.email}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {patient.city && patient.province ? `${patient.city}, ${patient.province}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(patient.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(patient._id, `${patient.firstName} ${patient.lastName}`)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </Card>
    </div>
  );
}
