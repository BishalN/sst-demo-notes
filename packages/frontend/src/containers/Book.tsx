import { API } from "aws-amplify";
import { useParams } from "react-router-dom";
import { SearchBookType } from "../types/searchBook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { useState } from "react";

export function BookPage() {
  const { id } = useParams();
  const [addingNote, setAddingNote] = useState(false);

  const {
    data: book,
    isLoading,
    error,
  } = useQuery({
    enabled: !!id,
    queryKey: ["book", id],
    queryFn: () => loadBook(id!),
  });

  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: addNotePending,
    error: addNoteError,
  } = useMutation({
    mutationKey: ["addNote"],
    mutationFn: addNote,
    onSuccess: () => {
      setAddingNote(false);
      queryClient.invalidateQueries({
        queryKey: ["book", id],
      });
    },
  });

  async function addNote() {
    await API.put("books", `/books/${id}`, {
      body: {
        notes: note,
      },
    });
  }

  const [note, setNote] = useState(book?.notes || "");

  function loadBook(id: string): Promise<SearchBookType> {
    return API.get("books", `/books/${id}`, {});
  }

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (!book) return <div>Book not found</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <h2>{book.subtitle}</h2>
      <p>{book.first_sentence}</p>
      <p>by {book.author_name}</p>

      {addingNote ? (
        <div>
          <textarea
            name="note"
            id="note"
            style={{ width: "100%" }}
            rows={10}
            placeholder="Write your notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <Button
            disabled={addNotePending}
            variant="secondary"
            onClick={() => mutateAsync()}
          >
            Save Note
          </Button>

          {addNoteError && <div>Error: {addNoteError.message}</div>}
        </div>
      ) : (
        <div>
          {book.notes && (
            <div>
              <h3>Notes:</h3>
              <p>{book.notes}</p>
            </div>
          )}
          <Button
            onClick={() => setAddingNote(!addingNote)}
            variant="secondary"
          >
            {book.notes ? "Edit Note" : "Add Note"}
          </Button>
        </div>
      )}
    </div>
  );
}
