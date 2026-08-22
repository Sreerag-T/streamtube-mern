import { Link } from "react-router-dom";

const formatViews = (views) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
};

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
};

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <img className="video-thumb" src={video.thumbnailUrl} alt={video.title} loading="lazy" />
      <div className="video-meta">
        <img
          className="video-channel-avatar"
          src={video.channel?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.channel?.channelName}`}
          alt={video.channel?.channelName}
        />
        <div className="video-info">
          <div className="video-title">{video.title}</div>
          <div className="video-sub">{video.channel?.channelName}</div>
          <div className="video-sub">
            {formatViews(video.views)} &middot; {timeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
export { formatViews, timeAgo };
