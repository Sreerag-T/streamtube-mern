import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

const CreateChannel = () => {
  const { user, updateStoredUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ channelName: "", handle: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.channelName.trim().length < 3) {
      setError("Channel name must be at least 3 characters.");
      return;
    }
    if (!form.handle.trim()) {
      setError("Please choose a handle for your channel.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/channels", form);
      const updatedUser = { ...user, channels: [...(user.channels || []), data._id] };
      updateStoredUser(updatedUser);
      navigate(`/channel/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create channel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-card">
      <h1 className="page-card-title">How you'll appear</h1>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="channelName">
            Channel name
          </label>
          <input
            id="channelName"
            name="channelName"
            className="form-input"
            value={form.channelName}
            onChange={handleChange}
            placeholder="e.g. Code with Sreerag"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="handle">
            Handle
          </label>
          <input
            id="handle"
            name="handle"
            className="form-input"
            value={form.handle}
            onChange={handleChange}
            placeholder="@yourhandle"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            value={form.description}
            onChange={handleChange}
            placeholder="What's your channel about?"
          />
        </div>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;
