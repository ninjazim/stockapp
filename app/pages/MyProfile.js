import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import PollListItemEditable from '../components/PollListItemEditable';

class MyProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      polls: []
    };
  }

  componentDidMount() {
    axios.get(`/api/polls?filter=user&username=${this.props.user.username}`)
      .then(response => {
        this.setState({
          polls: response.data
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user.username != nextProps.user.username) {
      axios.get(`/api/polls?filter=user&username=${nextProps.user.username}`)
        .then(response => {
          this.setState({
            polls: response.data
          });
        });
    }
  }

  render () {
    if (!this.props.user || !this.props.user.username) {
      return (
        <Section>
          <Container>
            <p>Sign in to see your polls.</p>
          </Container>
        </Section>
      );
    }

    return (
      <Section>
        <Logout href='/logout'>Logout</Logout>
        <Container>
          <SectionTitle>
            Your Polls
          </SectionTitle>
          <PollContainer>
            {this.state.polls.map((poll, i) =>
              <PollListItemEditable key={i} poll={poll} {...this.props} />
            )}
          </PollContainer>
        </Container>
      </Section>
    );
  }
}


export default MyProfile;

const Section = styled.div`
  width: 100%;
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

const Logout = styled.a`
  color: #333;
  text-align: right;
  padding-right: 20px;
  margin-top: -30px;
  margin-bottom: 30px;
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
