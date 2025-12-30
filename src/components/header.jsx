import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../styles/headerstyles.css";

export default function Header({ sortOption, onSortChange }) {
  if (typeof onSortChange !== "function") return null;

  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="site-header__logo">
          Store
        </Link>

        <nav className="site-header__nav">
          <Link to="/cartPage">MyCart</Link>
        </nav>
      </div>

      <div className="header-middle">
        <SearchBar />
      </div>

      <div className="header-right">
        <select
          value={sortOption ?? "relevance"}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="priceLow">Price: Low–High</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </header>
  );
}
