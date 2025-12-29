import React, { useEffect, useRef } from "react";
import { Container, Navbar } from "react-bootstrap";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import LoginModal from "./LoginModal";
import { userService } from "../_services";
import { history } from "../_helpers";
import { useAuth } from "../contexts/AuthContext";

interface MatchParams {
  id: string;
  docid: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
  hideLoginButton?: boolean;
}

const MainPanel: React.FC<MatchProps> = (props) => {
  const { user, logout } = useAuth();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // poll for auth status, every 10 seconds
    intervalRef.current = window.setInterval(() => {
      console.log("Checking auth status");

      if (user && userService.timeLeft() < 10) {
        // TODO: Show error message
        console.warn("Your session is about to expire. Please save your work!");
      }

      if (user && !userService.isLoggedIn()) {
        console.log("Logging out");
        logout();
      }
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, logout]);

  const docid = props.match.params.docid;
  const datasetid = props.match.params.id;

  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href={process.env.PUBLIC_URL}>
            <img
              alt=""
              src={`${process.env.PUBLIC_URL}/logo-black-trans.png`}
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Collapse className="mr-auto">
              <Navbar.Text className="px-2">
                <Link to="/">Home</Link>
              </Navbar.Text>
              {datasetid && <Navbar.Text className="px-1">{">"}</Navbar.Text>}
              <Navbar.Text className="px-2">
                <Link to={`/dataset/${datasetid}`}>{datasetid}</Link>
              </Navbar.Text>
              {docid && <Navbar.Text className="px-1">{">"}</Navbar.Text>}
              <Navbar.Text className="px-2">{docid}</Navbar.Text>
            </Navbar.Collapse>

            {!props.hideLoginButton && (
              <Navbar.Collapse className="justify-content-end">
                {user && user.username ? (
                  <>
                    <Navbar.Text className="px-3">
                      {`Signed in as: ${user.username}`}
                      {user.readOnly && ` (Read-only)`}
                    </Navbar.Text>
                    <button
                      className="btn btn-dark ml-3"
                      onClick={() => {
                        history.push(process.env.PUBLIC_URL + "/");
                        logout();
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : null}
              </Navbar.Collapse>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal show={!user || !user.username} />
      <Container fluid className="flex-column h-100 d-flex">
        {props.children}
      </Container>
    </>
  );
};

const connectedMainPanel = withRouter(MainPanel);
export { connectedMainPanel as MainPanel };
