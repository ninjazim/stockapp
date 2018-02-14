import React from 'react';
import { Link } from 'react-router-dom';

const HelloWorld = () => (
  <div>
    <p>Hello, World!</p>
    <Link to={'/goodbye'}>Goodbye</Link>
  </div>
);

export default HelloWorld;
