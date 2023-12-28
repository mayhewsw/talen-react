import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { State } from "../_utils/types";
import { connect } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import LoginModal from "./LoginModal";
import { userActions } from "../_actions";

class MainPanel extends React.Component<MatchProps> {
  render() {
    const docid = this.props.match.params.docid;
    const datasetid = this.props.match.params.id;

    return (
      <>
        <Navbar bg="light" expand="lg" fixed="top">
          <Container fluid>
            <Navbar.Brand href={process.env.PUBLIC_URL}>
              <img
                alt=""
                src={`${process.env.PUBLIC_URL}/logo-black-trans.png`}
                //width="30"
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

              {this.props.hideLoginButton ? null : (
                <>
                  <Navbar.Collapse className="justify-content-end">
                    {this.props.userName ? (
                      <>
                        <Navbar.Text className="px-3">
                          {`Signed in as: ${this.props.userName}`}
                          {this.props.readOnly && ` (Read-only)`}
                        </Navbar.Text>
                        <button
                          className="btn btn-dark ml-3"
                          onClick={() => {
                            this.props.logout();
                          }}
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </Navbar.Collapse>
                </>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <LoginModal
          show={this.props.userName ? false : true}
          handleClick={() => {
            console.log("haha");
          }}
        ></LoginModal>
        <Container fluid className="flex-column h-100 d-flex">
          {this.props.children}
        </Container>
      </>
    );
  }
}

interface MatchProps extends RouteComponentProps<MatchParams> {
  userName: string;
  readOnly: boolean;
  hideLoginButton?: boolean;
  logout: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

const mapStateToProps = (state: State) => ({
  // TODO: this is not working!
  // loggedIn: state.authentication.loggedIn,
  userName: state.authentication.user.username,
  readOnly: state.authentication.user.readOnly,
});

const actionCreators = {
  logout: userActions.logout,
};

const connectedMainPanel = withRouter(
  connect(mapStateToProps, actionCreators)(MainPanel)
);
export { connectedMainPanel as MainPanel };
