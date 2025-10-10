import React from "react";
import TaskCard from "./TaskCard";

export default function TaskList({ tasks = [], onTaskUpdated }) {
  return (
    <div className="row g-3">
      {tasks.map((t) => (
        <div key={t.id} className="col-12 col-md-6 col-lg-4">
          <TaskCard task={t} onTaskUpdated={onTaskUpdated} />
        </div>
      ))}
    </div>
  );
}
