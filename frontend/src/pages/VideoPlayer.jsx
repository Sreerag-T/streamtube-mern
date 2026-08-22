import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext.jsx";
import CommentSection from "../components/CommentSection.jsx";
import { formatViews, timeAgo } from "../components/VideoCard.jsx";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reacting, setReacting] = useState(false);
  const [myReaction, setMyReaction] = useState(null); // "like" | "dislike" | null

  const loadVideo = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/videos/${id}`);
      setVideo(data);
      setMyReaction(data.myReaction || null);
    } catch (err) {
      setError("Video not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideo();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const { data } = await api.get("/videos");
        setRelatedVideos(data.filter((v) => v._id !== id).slice(0, 8));
      } catch (err) {
        // silently ignore - related list is a nice-to-have
      }
    };
    loadRelated();
  }, [id]);

  const react = async (type) => {
    if (!user) return;
    setReacting(true);
    try {
      const { data } = await api.put(`/videos/${id}/${type}`);
      setVideo((prev) => ({ ...prev, likeCount: data.likes, dislikeCount: data.dislikes }));
      setMyReaction(data.liked ? "like" : data.disliked ? "dislike" : null);
    } catch (err) {
      // ignore
    } finally {
      setReacting(false);
    }
  };

  if (loading) return <p className="loading-text">Loading video...</p>;
  if (error || !video) return <p className="empty-state">{error || "Video not found."}</p>;

  const likeCount = video.likeCount ?? 0;
  const dislikeCount = video.dislikeCount ?? 0;
  const likedByMe = myReaction === "like";
  const dislikedByMe = myReaction === "dislike";

  return (
    <div className="player-layout">
      <div>
        <div className="video-player-wrap">
          <video src={video.videoUrl} controls poster={video.thumbnailUrl} />
        </div>

        <h1 className="player-title">{video.title}</h1>

        <div className="player-channel-row">
          <Link to={`/channel/${video.channel?._id}`} className="player-channel-info">
            <img
              className="video-channel-avatar"
              src={video.channel?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.channel?.channelName}`}
              alt={video.channel?.channelName}
            />
            <div>
              <div className="player-channel-name">{video.channel?.channelName}</div>
              <div className="player-subs">{video.channel?.subscribers?.toLocaleString()} subscribers</div>
            </div>
          </Link>

          <div className="player-actions">
            <div className="reaction-group">
              <button
                className={`reaction-btn ${likedByMe ? "active" : ""}`}
                onClick={() => react("like")}
                disabled={!user || reacting}
                title={user ? "Like" : "Sign in to like"}
              >
                &#128077; {likeCount}
              </button>
              <div className="reaction-divider" />
              <button
                className={`reaction-btn ${dislikedByMe ? "active" : ""}`}
                onClick={() => react("dislike")}
                disabled={!user || reacting}
                title={user ? "Dislike" : "Sign in to dislike"}
              >
                &#128078; {dislikeCount}
              </button>
            </div>
          </div>
        </div>

        <div className="player-desc">
          <div className="views-date">
            {formatViews(video.views)} &middot; {timeAgo(video.createdAt)}
          </div>
          {video.description || "No description provided."}
        </div>

        <CommentSection videoId={video._id} />
      </div>

      <div>
        <div className="up-next-heading">Up next</div>
        {relatedVideos.map((v) => (
          <Link key={v._id} to={`/video/${v._id}`} className="up-next-item">
            <img className="up-next-thumb" src={v.thumbnailUrl} alt={v.title} />
            <div>
              <div className="up-next-title">{v.title}</div>
              <div className="up-next-sub">{v.channel?.channelName}</div>
              <div className="up-next-sub">{formatViews(v.views)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
