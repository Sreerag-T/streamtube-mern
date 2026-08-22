import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const UploadVideo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myChannels, setMyChannels] = useState([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    category: "Web Development",
    channelId: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const loadChannels = async () => {
      try {
        const { data } = await api.get("/channels/mine/list");
        setMyChannels(data);
        if (data.length === 0) {
          navigate("/create-channel");
        } else {
          setForm((prev) => ({ ...prev, channelId: data[0]._id }));
        }
      } catch (err) {
        setError("Could not load your channels.");
      } finally {
        setLoadingChannels(false);
      }
    };
    loadChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required.");
    if (!form.thumbnailUrl.trim()) return setError("Thumbnail URL is required.");
    if (!form.videoUrl.trim()) return setError("Video URL is required.");

    setSubmitting(true);
    try {
      const { data } = await api.post("/videos", form);
      navigate(`/video/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload video.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingChannels) return <p className="loading-text">Loading...</p>;

  return (
    <div className="page-card">
      <h1 className="page-card-title">Upload video</h1>

      {error && <div className="form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        {myChannels.length > 1 && (
          <div className="form-group">
            <label className="form-label" htmlFor="channelId">
              Channel
            </label>
            <select
              id="channelId"
              name="channelId"
              className="form-input"
              value={form.channelId}
              onChange={handleChange}
            >
              {myChannels.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.channelName}
                </option>
              ))}
            </select>
          </div>
        )}

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
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="videoUrl">
            Video URL
          </label>
          <input
            id="videoUrl"
            name="videoUrl"
            className="form-input"
            value={form.videoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
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
          {submitting ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;
