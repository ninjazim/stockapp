import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import PollListItem from '../components/PollListItem';

class AllPolls extends React.Component {
  constructor() {
    super();
    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    axios.get(`/api/polls`)
      .then(response => {
        this.setState({
          polls: response.data
        });
      });
  }

  render () {
    return (
      <Section>
        <Container>
          <SectionTitle>
            All Polls
          </SectionTitle>
          <PollContainer>
            {this.state.polls.map((poll, i) =>
              <PollListItem key={i} poll={poll} {...this.props} />
            )}
          </PollContainer>
        </Container>
      </Section>
    );
  }
}

export default AllPolls;

const Section = styled.div`
  width: 100%;
  min-height: 400px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${'' /* background: tomato; */}
  box-sizing: border-box;
`;

const Container = styled.div`
  max-width: 800px;
  margin: auto;
`;

const SectionTitle = styled.h1`
  color: #333;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  padding-bottom: 20px;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
  margin: auto;
`;

const LinkBox = styled(Link)`
  padding: 20px 0 0;
  min-width: 100px;
  margin: 10px;
  color: #333;
  text-decoration: none;
`;
