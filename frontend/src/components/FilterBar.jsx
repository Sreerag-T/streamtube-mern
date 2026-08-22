const CATEGORIES = [
  "All",
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

const FilterBar = ({ active, onSelect }) => {
  return (
    <div className="filter-bar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${active === cat ? "active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
