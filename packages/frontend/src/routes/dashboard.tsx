import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: () => <div>Hello world</div>,
});

// now the real deal of creating application with sst starts
// create crud api for book collection and notes manager

// create, read(single, all), update, delete api for book collection
// thats it on the backend side
// on frontend side, use openlibrary api to search for books and add to collection
