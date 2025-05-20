import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ serviceType: "", date: "", notes: "" });

  const [selectedAppt, setSelectedAppt] = useState(null); // for modal

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Error fetching appointments");
      setAppointments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5050/api/appointments",
        { serviceType, date, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment booked!");
      setServiceType("");
      setDate(new Date());
      setNotes("");
      fetchAppointments();
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchAppointments();
    } catch {
      toast.error("Delete failed");
    }
  };

  const startEdit = (appt) => {
    setEditingId(appt._id);
    setEditForm({
      serviceType: appt.serviceType,
      date: new Date(appt.date),
      notes: appt.notes,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ serviceType: "", date: "", notes: "" });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:5050/api/appointments/${id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment updated");
      cancelEdit();
      fetchAppointments();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const openModal = (appt) => setSelectedAppt(appt);
  const closeModal = () => setSelectedAppt(null);

  return (
    <div className="min-h-screen bg-[#FDF5F0] text-[#2A4759] p-6 font-sans relative">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">My Appointments</h2>
          <button
            className="bg-[#F79B72] text-white px-4 py-2 rounded hover:bg-[#e88d66]"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-300 p-6 rounded shadow mb-6"
        >
          <h3 className="text-xl font-semibold mb-4">Book Appointment</h3>
          <div className="grid sm:grid-cols-4 gap-4 items-start">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
              required
            >
              <option value="">Select service</option>
              <option value="consultation">Consultation</option>
              <option value="therapy">Therapy</option>
              <option value="checkup">Checkup</option>
            </select>

            <DatePicker
              selected={date}
              onChange={(val) => setDate(val)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="Pp"
              className="w-full border border-gray-300 p-2 rounded"
            />

            <input
              type="text"
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full"
            />

            <button
              type="submit"
              className="bg-[#2A4759] text-white px-4 py-2 rounded w-full"
            >
              Book
            </button>
          </div>
        </form>

        {/* List */}
        {appointments.length === 0 ? (
          <p className="text-center text-gray-600">No appointments yet.</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white border border-gray-300 rounded p-4 mb-4 shadow"
            >
              {editingId === appt._id ? (
                <>
                  <div className="grid sm:grid-cols-3 gap-3 mb-3">
                    <select
                      value={editForm.serviceType}
                      onChange={(e) =>
                        setEditForm({ ...editForm, serviceType: e.target.value })
                      }
                      className="border p-2 rounded w-full"
                    >
                      <option value="">Select service</option>
                      <option value="consultation">Consultation</option>
                      <option value="therapy">Therapy</option>
                      <option value="checkup">Checkup</option>
                    </select>

                    <DatePicker
                      selected={new Date(editForm.date)}
                      onChange={(val) => setEditForm({ ...editForm, date: val })}
                      showTimeSelect
                      dateFormat="Pp"
                      className="border p-2 rounded w-full"
                    />

                    <input
                      type="text"
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(appt._id)}
                      className="bg-[#2A4759] text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-semibold capitalize">{appt.serviceType}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(appt.date).toLocaleString()}
                  </p>
                  <p className="text-sm">{appt.notes}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => openModal(appt)}
                      className="bg-[#4F83CC] text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => startEdit(appt)}
                      className="bg-[#2A4759] text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(appt._id)}
                      className="bg-[#F79B72] text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Appointment Details</h3>
            <p>
              <span className="font-semibold">Service:</span>{" "}
              {selectedAppt.serviceType}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(selectedAppt.date).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Notes:</span>{" "}
              {selectedAppt.notes || "None"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
