import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { State } from "../_utils/types";
import { connect } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";

class MainPanel extends React.Component<MatchProps> {
  render() {
    console.log(this.props.hideLoginButton);
    return (
      <div>
        <Navbar bg="light" expand="lg" fixed="top">
          <Container>
            <Navbar.Brand href="">TALEN</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Navbar.Collapse className="mr-auto">
                <Navbar.Text className="px-2">
                  <Link to="/">Home</Link>
                </Navbar.Text>
                <Navbar.Text className="px-2">
                  <Link to={`/dataset/${this.props.match.params.id}`}>
                    {this.props.match.params.id}
                  </Link>
                </Navbar.Text>
                <Navbar.Text className="px-2">
                  {this.props.match.params.docid}
                </Navbar.Text>
              </Navbar.Collapse>

              {this.props.hideLoginButton ? null : (
                <>
                  <Navbar.Collapse className="justify-content-end">
                    {this.props.userName ? (
                      <>
                        <Navbar.Text className="px-3">{`Signed in as: ${this.props.userName}`}</Navbar.Text>
                        <Link to="/login">Logout</Link>
                      </>
                    ) : (
                      <Navbar.Text>
                        <Link to="/login">Login</Link>
                      </Navbar.Text>
                    )}
                  </Navbar.Collapse>
                </>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>{this.props.children}</Container>
      </div>
    );
  }
}

interface MatchProps extends RouteComponentProps<MatchParams> {
  userName: string;
  hideLoginButton?: boolean;
}

interface MatchParams {
  id: string;
  docid: string;
}

const mapStateToProps = (state: State) => ({
  // TODO: this is not working!
  // loggedIn: state.authentication.loggedIn,
  userName: state.authentication.user.username,
});

const mapDispatchToProps = (dispatch: Function) => ({});

const connectedMainPanel = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MainPanel)
);
export { connectedMainPanel as MainPanel };
