import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '../config/config';

// import Poll from '../components/Poll';
import PopularPolls from '../components/PopularPolls';
import RecentPolls from '../components/RecentPolls';

class Polls extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render () {
    return (
      <div>
        <PopularPolls {...this.props} />
        <RecentPolls {...this.props} />
      </div>
    );
  }
}

export default Polls;

const Section = styled.div`
  width: 100%;
  min-height: 500px;
  border-bottom: 2px solid tomato;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${'' /* background: tomato; */}
  box-sizing: border-box;
`;

const SectionTitle = styled.h1`
  color: #333;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  padding: 0 0 20px 20px;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  width: auto;
  margin: 0 20px;
`;
