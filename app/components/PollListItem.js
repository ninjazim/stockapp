import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '../config/config';

class PollListItem extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  render () {
    let poll = this.props.poll;
    let creatorUsername = poll.creator.github.username;
    let createdAt = new Date(poll.createdAt).toLocaleString();
    return (
      <Item to={`/polls/${this.props.poll._id}`}>
        <Title>{poll.title}</Title>
        <Details>{new Date(poll.createdAt).toLocaleDateString()} - {creatorUsername}</Details>
        <Details>{poll.totalVotes} votes</Details>
      </Item>
    );
  }
}

export default PollListItem;

const Item = styled(Link)`
  padding: 20px;
  border: 1px solid lightgray;
  margin: 0 0 5px;

  box-shadow: 0px 1px 2px 1px rgba(0,0,0,0.1);
  text-decoration: none;
  max-width: 800px;
  min-width: 500px;
  background: linear-gradient(#f3f3f3,#fefefe);
  &:hover {
    background: #fefefe;
  }
`;

// const Item = styled.div`
//   min-width: 350px;
//   height: 400px;
//   background: white;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   color: #333;
//   padding: 20px;
//   box-sizing: border-box;
//   box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.2);
//   margin: 0 20px 0 0;
//
//   &:last-of-type {
//     margin-right: 0;
//   }
// `;

const Title = styled.h1`
  color: #333;
  font-size: 1.5rem;
  line-height: 2rem;
  margin: 0;
  font-weight: 400;

`;

const Details = styled.p`
  color: #999;
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0;
`;


//
// const SectionTitle = styled.h1`
//   color: #333;
//   font-weight: 400;
//   font-size: 1.5rem;
//   margin: 0;
//   padding: 0 0 20px 20px;
// `;
//
// const PollContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   overflow-x: auto;
//   width: auto;
//   margin: 0 20px;
// `;
