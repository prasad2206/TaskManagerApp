import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";
import API from "../services/api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";



function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  } catch {
    return "Invalid date";
  }
}

export default function TaskCard({ task, onTaskUpdated }) {
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const status = (task.status || "Pending").toLowerCase();
  const badgeClass =
    status === "completed" ? "bg-success" : "bg-warning text-dark";

  // handle delete
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: `Are you sure you want to delete "${task.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setDeleting(true);
    try {
      const res = await API.delete(`/task/${task.id}`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Task deleted successfully!");
        onTaskUpdated(); // refresh dashboard
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete task. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
            {task.description || "—"}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className={`badge ${badgeClass}`}>{task.status}</span>
            <small className="text-muted">{formatDate(task.dueDate)}</small>
          </div>

          <div className="d-flex justify-content-between mt-3">
            <button
              onClick={() => setShowEdit(true)}
              className="btn btn-sm btn-outline-primary"
            >
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="btn btn-sm btn-outline-danger"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      <EditTaskModal
        show={showEdit}
        task={task}
        onClose={() => setShowEdit(false)}
        onTaskUpdated={onTaskUpdated}
      />
    </>
  );
}
