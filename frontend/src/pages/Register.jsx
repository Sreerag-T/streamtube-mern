import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!form.username || form.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!form.password || form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(form.username, form.email, form.password);
      setSuccessMsg("Account created! Redirecting to sign in...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      }
      setFormError(data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Sign up to comment, like videos and start your own channel.</p>

      {formError && !successMsg && <div className="form-error-banner">{formError}</div>}
      {successMsg && <div className="form-success-banner">{successMsg}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className={`form-input ${fieldErrors.username ? "invalid" : ""}`}
            value={form.username}
            onChange={handleChange}
          />
          {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${fieldErrors.email ? "invalid" : ""}`}
            value={form.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`form-input ${fieldErrors.password ? "invalid" : ""}`}
            value={form.password}
            onChange={handleChange}
          />
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </div>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;
