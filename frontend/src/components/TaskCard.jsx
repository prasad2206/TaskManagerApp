import React, { useState } from "react";
import EditTaskModal from "./EditTaskModal";

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
  const status = (task.status || "Pending").toLowerCase();
  const badgeClass = status === "completed" ? "bg-success" : "bg-warning text-dark";

  return (
    <>
      <div className="card h-100 shadow-sm">
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{task.title}</h5>
          <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
            {task.description || "—"}
          </p>

          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className={`badge ${badgeClass}`}>{task.status || "Pending"}</span>
            <small className="text-muted">{formatDate(task.dueDate)}</small>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="btn btn-sm btn-outline-primary mt-3"
          >
            Edit
          </button>
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
