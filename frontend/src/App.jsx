import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Channel from "./pages/Channel.jsx";
import CreateChannel from "./pages/CreateChannel.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import EditVideo from "./pages/EditVideo.jsx";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app-shell">
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} onSearch={setSearchQuery} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? "" : "main-content--full"}`}>
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/create-channel" element={<CreateChannel />} />
            <Route path="/upload" element={<UploadVideo />} />
            <Route path="/video/:id/edit" element={<EditVideo />} />
            <Route path="*" element={<div className="not-found">Page not found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
