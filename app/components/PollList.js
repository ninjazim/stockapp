import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '../config/config';



class PollList extends React.Component {
  constructor() {
    super();
    this.state = {
      polls: [
        // {
        //   title: "What's a good Poll?",
        //   options: [
        //     {
        //       creator: "Poll Guy",
        //       name: "Favorite Color?"
        //     },
        //     {
        //       creator: "Random Guy",
        //       name: "Favorite Food?"
        //     },
        //   ],
        //   creator: "Poll Guy"
        // },
      ]
    };
  }

  componentDidMount() {
    let username = this.props.match.params.username || this.props.user.username;
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
        <SectionTitle>
        </SectionTitle>
        <PollContainer>
          {this.state.polls.map((poll, i) =>
            <PollListItem key={i} poll={poll} {...this.props} />
          )}
        </PollContainer>
      </Section>
    );
  }
}

export default PollList;

const Section = styled.div`
  width: 100%;
  min-height: 600px;
  border-bottom: 1px solid lightgray;
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
  flex-direction: column;
  overflow-x: auto;
  width: auto;
  margin: auto;
`;
