import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import Signup from "./containers/Signup.tsx";
import NewNote from "./containers/NewNote.tsx";
import Notes from "./containers/Notes.tsx";
import Settings from "./containers/Settings.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import { NewBookForm } from "./components/NewBookForm.tsx";
import { BookPage } from "./containers/Book.tsx";
import { BookSearch } from "./containers/BookSearch.tsx";

export default function Links() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <UnauthenticatedRoute>
            <Signup />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <AuthenticatedRoute>
            <BookSearch />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/notes/new"
        element={
          <AuthenticatedRoute>
            <NewNote />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/books/new"
        element={
          <AuthenticatedRoute>
            <NewBookForm />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/books/:id"
        element={
          <AuthenticatedRoute>
            <BookPage />
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/notes/:id"
        element={
          <AuthenticatedRoute>
            <Notes />
          </AuthenticatedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}
