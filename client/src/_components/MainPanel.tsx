import React from "react";
import { Container, Navbar } from "react-bootstrap";
import { State } from "../_utils/types";
import { connect } from "react-redux";
import { withRouter, Link, RouteComponentProps } from "react-router-dom";
import LoginModal from "./LoginModal";
import { userActions, alertActions } from "../_actions";
import { userService } from "../_services";
import { history } from "../_helpers";

class MainPanel extends React.Component<MatchProps> {
  interval: any;

  componentDidMount() {
    // poll for auth status, every 10 seconds
    this.interval = setInterval(this.checkAuthStatus, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  checkAuthStatus = () => {
    console.log("Checking auth status");

    if (this.props.userName && userService.timeLeft() < 10) {
      this.props.errorMessage(
        "Your session is about to expire. Please save your work!"
      );
    }

    if (this.props.userName && !userService.isLoggedIn()) {
      console.log("Logging out");
      this.props.clearMessage();
      this.props.logout();
    }
  };

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
                            history.push(process.env.PUBLIC_URL + "/");
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
          registering={!this.props.userName && this.props.registering}
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
  registering: boolean;
  hideLoginButton?: boolean;
  logout: any;
  errorMessage: any;
  clearMessage: any;
}

interface MatchParams {
  id: string;
  docid: string;
}

const mapStateToProps = (state: State) => ({
  userName: state.authentication.user.username,
  readOnly: state.authentication.user.readOnly,
  registering: state.registration.registering,
});

const actionCreators = {
  errorMessage: alertActions.error,
  clearMessage: alertActions.clear,
  logout: userActions.logout,
  toggleRegistering: userActions.toggleRegistering,
};

const connectedMainPanel = withRouter(
  connect(mapStateToProps, actionCreators)(MainPanel)
);
export { connectedMainPanel as MainPanel };
