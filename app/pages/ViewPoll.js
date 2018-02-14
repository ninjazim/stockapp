import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import {Doughnut} from 'react-chartjs-2';
import { BASE_URL } from '../config/config';

import Poll from '../components/Poll';

class ViewPoll extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    axios.get(`/api/polls/${id}`)
      .then(response => {
        this.setState({
          poll: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render () {
    if (Object.keys(this.state).length === 0) {
      return (
        <Section>

        </Section>
      );
    }

    let poll = this.state.poll;

    return (
      <div>
        <Section red>
        </Section>
        <Section>
          <Container>
            <Poll poll={poll} isLoggedIn={this.props.isLoggedIn} user={this.props.user} />
          </Container>
        </Section>
      </div>
    );
  }
}

export default ViewPoll;

const Section = styled.div`
  width: 100%;
  min-height: ${props =>
    (props.tall && '600px')
    || '400px'
  };
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props =>
    (props.red && 'tomato')
    || '#eee'
  };
  box-sizing: border-box;
`;

const Container = styled.div`
  max-width: 80%;
  margin: auto;
  margin-top: -300px;
`;

const ChartContainer = styled.div`
  max-width: 80%;
  margin: auto;
  background-color: #eee;
  padding: 20px;
`;
