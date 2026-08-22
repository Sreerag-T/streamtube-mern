import { NavLink } from "react-router-dom";

const primaryLinks = [
  { icon: "\u{1F3E0}", label: "Home", to: "/" },
  { icon: "\u{1F525}", label: "Trending", to: "/?category=Trending" },
  { icon: "\u{1F4FA}", label: "Subscriptions", to: "/?category=Subscriptions" },
];

const exploreLinks = [
  { icon: "\u{1F3AE}", label: "Gaming", to: "/?category=Gaming" },
  { icon: "\u{1F3B5}", label: "Music", to: "/?category=Music" },
  { icon: "\u{1F4F0}", label: "News", to: "/?category=News" },
  { icon: "\u26BD", label: "Sports", to: "/?category=Sports" },
  { icon: "\u{1F393}", label: "Education", to: "/?category=Education" },
];

const Sidebar = ({ open }) => {
  return (
    <aside className={`sidebar ${open ? "" : "sidebar--collapsed"}`}>
      <div className="sidebar-group">
        {primaryLinks.map((link) => (
          <NavLink key={link.label} to={link.to} end={link.to === "/"} className="sidebar-link">
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="sidebar-group">
        {!open ? null : <div style={{ padding: "4px 24px", color: "var(--text-dim)", fontSize: 13, fontWeight: 600 }}>Explore</div>}
        {exploreLinks.map((link) => (
          <NavLink key={link.label} to={link.to} className="sidebar-link">
            <span className="sidebar-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
