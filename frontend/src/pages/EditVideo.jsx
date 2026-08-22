import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = [
  "Web Development",
  "JavaScript",
  "Data Structures",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Entertainment",
];

const EditVideo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const loadVideo = async () => {
      try {
        const { data } = await api.get(`/videos/${id}`);
        if (data.uploader !== user.id) {
          setError("You are not authorized to edit this video.");
        }
        setForm({
          title: data.title,
          description: data.description || "",
          thumbnailUrl: data.thumbnailUrl,
          videoUrl: data.videoUrl,
          category: data.category,
        });
      } catch (err) {
        setError("Could not load video.");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.put(`/videos/${id}`, form);
      navigate(`/video/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update video.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!form) return <p className="empty-state">{error || "Video not found."}</p>;

  return (
    <div className="page-card">
      <h1 className="page-card-title">Edit video</h1>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input id="title" name="title" className="form-input" value={form.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            name="thumbnailUrl"
            className="form-input"
            value={form.thumbnailUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="videoUrl">
            Video URL
          </label>
          <input id="videoUrl" name="videoUrl" className="form-input" value={form.videoUrl} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">
            Category
          </label>
          <select id="category" name="category" className="form-input" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
