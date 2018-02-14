import React from 'react';
import { Link } from 'react-router-dom';

const GoodbyeWorld = () => (
  <div>
    <p>Goodbye, World!</p>
    <Link to={'/'}>Hello</Link>
  </div>
);

export default GoodbyeWorld;
