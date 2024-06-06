import Navbar from "react-bootstrap/Navbar";
import { AppContext, AppContextType } from "./lib/contextLib";

import Routes from "./Routes";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";

function App() {
  const nav = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);

  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);

    nav("/login");
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }
    setIsAuthenticating(false);
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
          <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav style={{ width: "100%" }} activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: "underline",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <LinkContainer to="/">
                      <Nav.Link>My Collections</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/notes">
                      <Nav.Link>Notes</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/search">
                      <Nav.Link>Search</Nav.Link>
                    </LinkContainer>
                  </div>

                  <div style={{ display: "flex", gap: "5px" }}>
                    <LinkContainer to="/settings">
                      <Nav.Link>Settings</Nav.Link>
                    </LinkContainer>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </div>
                </div>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <main>
          <AppContext.Provider
            value={{ isAuthenticated, userHasAuthenticated } as AppContextType}
          >
            <Routes />
          </AppContext.Provider>
        </main>
      </div>
    )
  );
}
export default App;
