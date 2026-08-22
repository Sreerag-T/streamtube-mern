import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import { formatViews } from "../components/VideoCard.jsx";

const Channel = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadChannel = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/channels/${id}`);
      setChannel(data);
    } catch (err) {
      setError("Channel not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannel();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video? This cannot be undone.")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      setChannel((prev) => ({ ...prev, videos: prev.videos.filter((v) => v._id !== videoId) }));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete video.");
    }
  };

  if (loading) return <p className="loading-text">Loading channel...</p>;
  if (error || !channel) return <p className="empty-state">{error || "Channel not found."}</p>;

  const isOwner = user && channel.owner?._id === user.id;

  return (
    <div>
      {channel.channelBanner && (
        <img className="channel-banner" src={channel.channelBanner} alt={`${channel.channelName} banner`} />
      )}

      <div className="channel-header">
        <img
          className="channel-avatar-lg"
          src={channel.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${channel.channelName}`}
          alt={channel.channelName}
        />
        <div>
          <div className="channel-name-lg">{channel.channelName}</div>
          <div className="channel-handle">
            {channel.handle} &middot; {channel.subscribers?.toLocaleString()} subscribers &middot; {channel.videos?.length || 0} videos
          </div>
          <div className="video-sub">{channel.description}</div>
        </div>
        {isOwner && (
          <div className="channel-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/upload")}>
              Upload video
            </button>
          </div>
        )}
      </div>

      <div className="channel-tabs">
        <button className="channel-tab active">Videos</button>
      </div>

      {channel.videos?.length === 0 ? (
        <p className="empty-state">This channel hasn't uploaded any videos yet.</p>
      ) : (
        <div className="video-grid">
          {channel.videos.map((video) => (
            <div key={video._id} className="owner-video-card">
              <Link to={`/video/${video._id}`}>
                <img className="video-thumb" src={video.thumbnailUrl} alt={video.title} />
                <div className="video-title" style={{ marginTop: 8 }}>
                  {video.title}
                </div>
                <div className="video-sub">{formatViews(video.views)}</div>
              </Link>
              {isOwner && (
                <div className="owner-video-actions">
                  <button onClick={() => navigate(`/video/${video._id}/edit`)}>Edit</button>
                  <button className="danger" onClick={() => handleDeleteVideo(video._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;
