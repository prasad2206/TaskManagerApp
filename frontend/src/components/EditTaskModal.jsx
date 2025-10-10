// src/components/EditTaskModal.jsx
import React, { useEffect, useRef } from "react";
import API from "../services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const todayStr = new Date().toISOString().split("T")[0];

const schema = yup.object({
  title: yup.string().required("Title is required").min(3),
  description: yup.string().max(1000),
  status: yup.string().oneOf(["Pending","Completed"]).required(),
  dueDate: yup.string().nullable().test("is-valid-or-future", "Due date must be today or later", value => {
    if (!value) return true;
    return new Date(value) >= new Date(todayStr);
  })
}).required();

export default function EditTaskModal({ show, onClose, task, onTaskUpdated }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", status: "Pending", dueDate: "" }
  });
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : ""
      });
    }
  }, [task, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await API.put(`/task/${task.id}`, data);
      if (res.status === 200) {
        // Show global toast, keep modal open briefly, then close and navigate to dashboard
        toast.success("Task Updated successfully!");

        // call onTaskUpdated so parent can refresh tasks
        onTaskUpdated();

        // wait 1s then close modal and navigate to dashboard
        timeoutRef.current = setTimeout(() => {
          onClose();
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update task");
    }
  };

  // cleanup timeout if modal unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className={`form-control ${errors.title ? "is-invalid" : ""}`} {...register("title")} />
                <div className="invalid-feedback">{errors.title?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className={`form-control ${errors.description ? "is-invalid" : ""}`} rows="3" {...register("description")}></textarea>
                <div className="invalid-feedback">{errors.description?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className={`form-select ${errors.status ? "is-invalid" : ""}`} {...register("status")}>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="invalid-feedback">{errors.status?.message}</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input type="date" className={`form-control ${errors.dueDate ? "is-invalid" : ""}`} {...register("dueDate")} />
                <div className="invalid-feedback">{errors.dueDate?.message}</div>
              </div>

              <button className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Task"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
