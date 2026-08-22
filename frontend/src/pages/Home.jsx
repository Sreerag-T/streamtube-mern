import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import FilterBar from "../components/FilterBar.jsx";
import VideoCard from "../components/VideoCard.jsx";

const Home = ({ searchQuery }) => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [category, setCategory] = useState(
    categoryFromUrl && ["Gaming", "Music", "News", "Sports", "Education"].includes(categoryFromUrl)
      ? categoryFromUrl
      : "All"
  );
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (category !== "All") params.category = category;
        const { data } = await api.get("/videos", { params });
        setVideos(data);
      } catch (err) {
        setError("Could not load videos. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [searchQuery, category]);

  return (
    <div>
      <FilterBar active={category} onSelect={setCategory} />

      {loading ? (
        <p className="loading-text">Loading videos...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : videos.length === 0 ? (
        <p className="empty-state">No videos found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
