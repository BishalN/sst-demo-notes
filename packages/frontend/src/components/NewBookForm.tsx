// there will be two ways of adding in a new book
// one by searching for a book and adding it to the collection
// the other by adding a book manually

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchBookType } from "../types/searchBook";
import { API } from "aws-amplify";

export function NewBookForm() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useQuery({
    enabled: debouncedTerm.length > 0,
    queryKey: ["search-books", debouncedTerm],
    queryFn: () => searchBooks(debouncedTerm),
  });

  const {
    mutateAsync: addBookAsync,
    isPending: addingBook,
    error: errorAddingBook,
  } = useMutation({
    mutationFn: addBook,
  });

  async function addBook(book: SearchBookType) {
    return API.post("books", "/books", {
      body: book,
    });
  }

  // TODO: add pagination to the search results, as well as filters for subject, author, full text etc..
  function searchBooks(searchTerm: string): Promise<Array<SearchBookType>> {
    return fetch(
      `https://openlibrary.org/search.json?title=${searchTerm}&limit=10`
    )
      .then((res) => res.json())
      .then((data) => data.docs);
  }

  function renderBookList() {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (data && data.length === 0) {
      return <div>No books found</div>;
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {data &&
          data.map((book) => (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
              key={Math.random()}
            >
              <h3>{book.title}</h3>
              <p>by {book.author_name.join(" , ")}</p>
              <button disabled={addingBook} onClick={() => addBookAsync(book)}>
                Add book
              </button>

              {errorAddingBook && (
                <div style={{ color: "red" }}>{errorAddingBook.message}</div>
              )}
            </div>
          ))}
      </div>
    );
  }

  return (
    <div>
      <h2>Add a new book</h2>
      <input
        style={{ width: "100%", margin: "10px 0 10px 0" }}
        type="search"
        name="search-term"
        id="search-term"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search book by name, author or genre"
      />

      {renderBookList()}
    </div>
  );
}
