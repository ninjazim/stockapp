import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '../config/config';

// import Poll from '../components/Poll';
import PollListItem from '../components/PollListItem';
// import RecentPolls from '../components/RecentPolls';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    let username = this.props.match.params.username;
    axios.get(`/api/polls?filter=user&username=${username}`)
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
            {this.props.match.params.username}'s Polls
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

export default Profile;

const Section = styled.div`
  width: 100%;
  min-height: 600px;
  padding: 40px 0;
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
  padding: 0 0 20px 0;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  width: auto;
  margin: auto;
`;
