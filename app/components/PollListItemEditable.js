import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { BASE_URL } from '../config/config';

class PollListItemEditable extends React.Component {
  constructor() {
    super();
    this.state = {
      deleted: false
    };

    this.confirmDelete = this.confirmDelete.bind(this);
    this.deletePoll = this.deletePoll.bind(this);
  }

  confirmDelete(poll) {
    let confirmed = confirm("Are you sure you want to delete this poll?");
    if (confirmed) {
      this.deletePoll(poll);
    } else {
      console.log("Ok nevermind!");
    }
  }

  deletePoll(poll) {
    console.log("Deleting poll:", poll._id);
    axios.delete(`/api/polls/${poll._id}`)
      .then(response => {
        if (response.data.deleted) {
          this.setState({
            deleted: true
          });
        }
      });
  }

  render () {
    if (this.state.deleted) {
      return <div></div>
    }
    let poll = this.props.poll;
    let creatorUsername = poll.creator.github.username;
    let createdAt = new Date(poll.createdAt).toLocaleDateString();
    return (
      <ItemContainer>
        <Item to={`/polls/${poll._id}`}>
          <Title>{poll.title}</Title>
          <Details>{createdAt}</Details>
          <Details>{poll.totalVotes} votes</Details>
        </Item>
        <ButtonContainer>
          <DeleteButton
            onClick={()=>this.confirmDelete(poll)}>
            ╳</DeleteButton>
        </ButtonContainer>
      </ItemContainer>

    );
  }
}

export default PollListItemEditable;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  box-shadow: 0px 1px 2px 1px rgba(0,0,0,0.1);
  max-width: 800px;
  min-width: 400px;
  margin: 0 0 5px;
  border: 1px solid lightgray;
`;

const ButtonContainer = styled.div`
  flex: 0;
  width: 50px;
  background-color: tomato;
  display: flex;
  align-items: center;
`;

const DeleteButton = styled.button`
  height: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 2rem;
  color: white;

  &:hover {
    cursor: pointer;
  }
  &:active {
    opacity: 0.5;
  }
`;

const Item = styled(Link)`
  padding: 20px;
  text-decoration: none;
  flex: 1;
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
