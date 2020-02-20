import * as React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => (
    <div>
        <h1>Home Page</h1>
        <nav>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/annotate">Annotate</Link>
        </nav>
    </div>
  );

export default HomePage;