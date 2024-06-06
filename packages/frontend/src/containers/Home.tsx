import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import { NoteType } from "../types/note";
import { API } from "aws-amplify";
import { LinkContainer } from "react-router-bootstrap";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookType } from "../types/book";
import { Button } from "react-bootstrap";

function loadNotes(): Promise<NoteType[]> {
  return API.get("notes", "/notes", {});
}

function formatDate(str: undefined | string) {
  return !str ? "" : new Date(str).toLocaleString();
}

export function Home() {
  const { isAuthenticated } = useAppContext();

  const { data: notes, isLoading } = useQuery({
    enabled: isAuthenticated,
    queryKey: ["notes"],
    queryFn: loadNotes,
  });

  function renderNotesList(notes: NoteType[]) {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>
        {notes.map(({ notesId, content, createdAt }) => (
          <LinkContainer key={notesId} to={`/notes/${notesId}`}>
            <ListGroup.Item action className="text-nowrap text-truncate">
              <span className="fw-bold">{content.trim().split("\n")[0]}</span>
              <br />
              <span className="text-muted">
                Created: {formatDate(createdAt)}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  function renderNotes() {
    if (isLoading) return <div>Loading...</div>;

    if (!isLoading && notes?.length === 0) {
      return (
        <div className="list-group-item">
          <h4 className="list-group-item-heading">Your Notes</h4>
          <p className="list-group-item-text">
            Your notes will be displayed here. Create a new note by clicking the
            button below.
          </p>
        </div>
      );
    }
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes!)}</ListGroup>
      </div>
    );
  }
  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

function renderLander() {
  return (
    <div className="lander">
      <h1>
        <Link to="/">Scratch</Link>
      </h1>
      <p className="text-muted">A simple note taking app</p>
    </div>
  );
}

function loadBooks(): Promise<Array<BookType>> {
  return API.get("books", "/books", {});
}

export default function NewHome() {
  const { isAuthenticated } = useAppContext();

  const booksData = useQuery({
    queryKey: ["books"],
    queryFn: loadBooks,
  });

  console.log(booksData.data);

  if (!isAuthenticated) {
    return renderLander();
  }

  return (
    <div className="Home">
      <p>Welcome to scratch</p>
      <input
        type="search"
        name="search-books"
        id="search-book"
        placeholder="Search books from your collection"
        style={{ width: "100%" }}
      />

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <h2>Books</h2>
        <Books />
      </div>
    </div>
  );
}

export function Books() {
  const { isAuthenticated } = useAppContext();

  const { isLoading, data, error } = useQuery({
    enabled: isAuthenticated,
    queryKey: ["books"],
    queryFn: loadBooks,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data && data.length === 0) {
    return (
      <div>
        <p>You don't have any books in your collection</p>
        <LinkContainer to="/books/new">
          <Button variant="secondary">Add a book</Button>
        </LinkContainer>
      </div>
    );
  }

  return (
    <div>
      {data?.map((book) => (
        <div key={book.bookId}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>
      ))}
    </div>
  );
}
