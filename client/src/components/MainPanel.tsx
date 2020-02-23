import React from 'react';
import { Button, Container, Row, Overlay, Navbar, Nav, NavDropdown, Form, FormControl, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { State } from '../utils/types';
import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'
import { logout, setErrorMessage } from '../utils/login'

class MainPanel extends React.Component<Props>{

    render() {
      return (
        <div>
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href=""><Link to="/">TALEN</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href=""><Link to="/">Home</Link></Nav.Link>
                <Nav.Link href=""><Link to="/anno">Annotate</Link></Nav.Link>
                
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button> 
            </Form>*/}
            {this.props.loggedIn ? 
                <>
                    {`Hello ${this.props.userName}`} 
                    <Button onClick={() => this.props.handleLogout()} variant="outline-success">Logout</Button> 
                </>
            : 
                <Nav.Link href=""><Link to="/login">Login</Link></Nav.Link>
            }
            

        </Navbar.Collapse>
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
  
