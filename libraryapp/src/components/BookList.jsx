import { useEffect, useState } from "react";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8888/api/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  return (
    <div>
      <h2>Books available</h2>
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        <ul>
          {books.map(book => (
            <li key={book._id || book.id}>
              <strong>{book.title}</strong> - by {book.author} ({book.genre})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;
