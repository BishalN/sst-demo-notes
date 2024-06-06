import { useQuery } from "@tanstack/react-query";
import { SearchBookType } from "../types/searchBook";
import { useDebounce } from "use-debounce";
import { useState } from "react";

export function BookSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useQuery({
    enabled: debouncedTerm.length > 0,
    queryKey: ["search-books", debouncedTerm],
    queryFn: () => searchBooks(debouncedTerm),
  });
  function searchBooks(searchTerm: string): Promise<Array<SearchBookType>> {
    return fetch(
      `https://openlibrary.org/search.json?title=${searchTerm}&limit=10`
    )
      .then((res) => res.json())
      .then((data) => data.docs);
  }
  return (
    <div>
      <input
        type="search"
        name="search"
        id="search"
        style={{
          width: "100%",
        }}
        placeholder="Search for a book"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && data.length === 0 && <div>No books found</div>}
      {data && (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {data.map((book) => (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>{book.title}</h3>
              <p>{book.author_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
