import React from 'react';
import { Button, Container, Navbar, Form } from 'react-bootstrap';
import { State } from '../utils/types';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

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
                {"" ? 
                    <>
                        <Navbar.Text className="px-3">{`Signed in as: ${this.props.userName}`}</Navbar.Text>
                        <Form inline> 
                            <Button onClick={() => console.log("logout")} variant="outline-success">Logout</Button> 
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
            {this.props.children}
        </Container>
        </div>
      )
    }
}

type Props = { 
    userName: string;
};

const mapStateToProps = (state: State) => ({
    // TODO: this is not working!
    userName: "dunno"
  })

  const mapDispatchToProps = (dispatch: Function) => ({
  })
  
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainPanel))
  
