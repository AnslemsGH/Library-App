import { useEffect, useState } from "react";

function AuthorList() {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/authors")
      .then(res => res.json())
      .then(data => setAuthors(data))
      .catch(err => console.error("Error fetching authors:", err));
  }, []);

  return (
    <div>
      <h2>Authors available in our Library</h2>
      {authors.length === 0 ? (
        <p>No authors found</p>
      ) : (
        <ul>
          {authors.map(author => (
            <li key={author._id || author.id} style={{ marginBottom: "10px" }}>
              <div><strong>{author.name}</strong></div>
              <div>Nationality: {author.nationality}</div>
              <div>Birth Year: {author.birthyear}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AuthorList;
