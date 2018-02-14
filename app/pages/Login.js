import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/config';

const Login = () => (
  <div>
    <p>Please login to continue!</p>
    <a href={`${BASE_URL}/auth/github`}>Sign in with Github</a>
  </div>
);

export default Login;
