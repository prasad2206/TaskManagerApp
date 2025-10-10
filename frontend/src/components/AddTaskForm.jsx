import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const todayStr = new Date().toISOString().split("T")[0];

const schema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title should be at least 3 characters"),
  description: yup.string().max(1000, "Description too long"),
  status: yup.string().oneOf(["Pending", "Completed"]).required(),
  dueDate: yup
    .string()
    .nullable()
    .test("is-valid-or-future", "Due date must be today or later", (value) => {
      if (!value) return true;
      return new Date(value) >= new Date(todayStr);
    }),
}).required();

export default function AddTaskForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", status: "Pending", dueDate: "" },
  });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/task/create", data);
      if (res.status === 200 || res.status === 201) {
        reset();
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 540 }}>
      <h3 className="mb-3">Add New Task</h3>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className={`form-control ${errors.title ? "is-invalid" : ""}`} {...register("title")} />
          <div className="invalid-feedback">{errors.title?.message}</div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            rows="3"
            {...register("description")}
          ></textarea>
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
          <input
            type="date"
            className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
            {...register("dueDate")}
          />
          <div className="invalid-feedback">{errors.dueDate?.message}</div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Task"}
          </button>
          <button
            type="button"
            className="btn btn-secondary w-100"
            onClick={() => navigate("/")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
