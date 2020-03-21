import React from 'react';
import { Button, Container, Row, Navbar, Nav, NavDropdown, Form, Alert } from 'react-bootstrap';
import { State } from '../utils/types';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout, setErrorMessage } from '../utils/login'

class MainPanel extends React.Component<Props>{

    render() {
      return (
        <div>
        <Navbar bg="light" expand="lg" fixed="top">
            <Container>
        <Navbar.Brand href="">TALEN</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Collapse className="mr-auto">
                <Navbar.Text className="px-2"><Link to="/">Home</Link></Navbar.Text>
                <Navbar.Text className="px-2"><Link to="/anno">Annotate</Link></Navbar.Text>                
            </Navbar.Collapse>

            <Navbar.Collapse className="justify-content-end">
                {this.props.loggedIn ? 
                    <>
                        <Navbar.Text className="px-3">{`Signed in as: ${this.props.userName}`}</Navbar.Text>
                        <Form inline> 
                            <Button onClick={() => this.props.handleLogout()} variant="outline-success">Logout</Button> 
                        </Form>
                    </>
                : 
                    <Navbar.Text><Link to="/login">Login</Link></Navbar.Text>
                }
            </Navbar.Collapse>

            

        </Navbar.Collapse>
        </Container>
        </Navbar>
        <Container>
            { this.props.errorMessage.length > 0 ? 
            <Row>
                <Alert variant="danger">
                    {this.props.errorMessage}
                </Alert>
            </Row> : null}
            {this.props.children}
        </Container>
        </div>
      )
    }
}

type Props = { 
    errorMessage: string;
    loggedIn: boolean;
    userName: string;
    handleLogout: Function
    clearErrors: Function
};

const mapStateToProps = (state: State) => ({
    errorMessage: state.errorMessage,
    loggedIn: state.loggedIn,
    userName: state.userName
  })

  const mapDispatchToProps = (dispatch: Function) => ({
    handleLogout: () => dispatch(logout()),
    clearErrors: () => dispatch(setErrorMessage(''))
  })
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPanel))
  
