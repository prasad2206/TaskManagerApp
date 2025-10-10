// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import TaskList from "../components/TaskList";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All"); // All | Pending | Completed
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/task"); // existing endpoint
      setTasks(response.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      if (err?.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      const msg = err?.response?.data?.message || "Unable to fetch tasks. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Client-side filter
  const filteredTasks = tasks.filter((t) => {
    if (!filterStatus || filterStatus === "All") return true;
    return (t.status || "").toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Tasks</h3>

        <div className="d-flex align-items-center">
          {/* Filter controls */}
          <div className="btn-group me-3" role="group" aria-label="status filter">
            {["All", "Pending", "Completed"].map((s) => (
              <button
                key={s}
                type="button"
                className={`btn btn-sm ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="btn btn-outline-primary me-2" onClick={fetchTasks} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {/* Add Task moved to Navbar for authenticated users */}
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {filteredTasks.length === 0 ? (
            <div className="alert alert-info">
              No tasks found for "{filterStatus}". Try switching filter or add a new task.
            </div>
          ) : (
            <TaskList tasks={filteredTasks} onTaskUpdated={fetchTasks} />
          )}
        </>
      )}
    </div>
  );
}
