import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import TaskList from "../components/TaskList";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await API.get("/task"); // GET /api/task
      setTasks(response.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      // Handle unauthorized -> logout & redirect to login
      if (err?.response?.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      // Show backend message if provided
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Tasks</h3>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={fetchTasks} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/tasks/new")}>
            Add Task
          </button>
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
          {tasks.length === 0 ? (
            <div className="alert alert-info">No tasks yet. Click <strong>Add Task</strong> to create one.</div>
          ) : (
            <TaskList tasks={tasks} onTaskUpdated={fetchTasks} />

          )}
        </>
      )}
    </div>
  );
}
