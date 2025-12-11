import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>Toronto Library</h1>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/books" style={{ color: "white", textDecoration: "none" }}>Books</Link>
        <Link to="/authors" style={{ color: "white", textDecoration: "none" }}>Authors</Link>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>
      </nav>
    </header>
  );
}

export default Header;
