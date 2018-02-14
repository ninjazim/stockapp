import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config/config';
import styled from 'styled-components';
import axios from 'axios';

import DonutChart from './DonutChart';

class Poll extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedName: '',
      selectedId: '',
      newOptionName: '',
      userHasVoted: false,
      poll: {},
    }

    this.submitVote = this.submitVote.bind(this);
    this.verifyVote = this.verifyVote.bind(this);
  }

  componentWillMount() {
    this.setState({
      poll: this.props.poll
    });
  }



  verifyVote() {
    let vote = {
      poll: {
        _id: this.props.poll._id,
      },
      option: {
        new: (this.state.selectedName === "Other" ? true : false),
        _id: this.state.selectedId,
        name: (this.state.selectedName === "Other" ? this.state.newOptionName : this.state.selectedName),
      }
    };

    if (!this.state.selectedName) {
      alert("Please select an option to vote!");
    } else if (this.state.selectedName === "Other" && (this.state.newOptionName.length === 0 || this.state.newOptionName.trim().length === 0)) {
      alert("Oops, looks like your new option is empty.");
    } else if (this.state.userHasVoted) {
      alert("Hey no fair! You already voted for this poll!");
    } else {
      let filteredOptions = this.state.poll.options.filter((option) => {
        return (this.state.newOptionName.trim().toLowerCase() === option.name.toLowerCase())
      });
      if (filteredOptions.length > 0) {
        vote.option = {
          new: false,
          _id: filteredOptions[0]._id,
          name: filteredOptions[0].name
        }
      }

      this.submitVote(vote);
    }
  }

  submitVote(vote) {

    axios.put(`/api/polls/${this.props.poll._id}`, vote)
      .then(response => {
        console.log(response);
        this.setState({
          selectedName: '',
          selectedId: '',
          newOptionName: '',
          userHasVoted: true,
          poll: response.data
        });
      }).catch(error => {
        alert(error);
      });
  }

  render() {
    let poll = this.state.poll;
    let username = poll.creator.github.username;

    return (
      <FlexContainer>
        <TitleContainer>
          <PollName>{poll.title}</PollName>
          <PollCreator>by <Link to={`/profile/${username}`} style={{color:'white'}}>{username}</Link></PollCreator>
        </TitleContainer>
        <Card>
        <DonutChart poll={poll} />
          <PollContainer>
            <PollOptions>
            {poll.options.map((option, i) => {
              return (
                <Option key={i}>
                  <RadioInput key={i}
                         type="radio"
                         onChange={() => this.setState({ selectedId: option._id, selectedName: option.name })}
                         checked={option._id === this.state.selectedId}
                         value={option.name}
                       />
                  <Label onClick={(e) => this.setState({ selectedId: option._id, selectedName: option.name })}>
                    {option.name}
                    {this.props.isLoggedIn && username == this.props.user.username &&
                      <span> ({option.votes})</span>
                    }
                    {option.creator.github && (poll.creator._id != option.creator._id) &&
                      <OptionCreator>{option.creator.github.username}</OptionCreator>
                    }
                  </Label>
                </Option>
              );
            })}
            {this.props.isLoggedIn &&
              <span>
                <Option  key="Other">
                  <RadioInput key="new"
                         type="radio"
                         onChange={() => this.setState({ selectedName: "Other", selectedId: '' })}
                         checked={"Other" === this.state.selectedName}
                         value={"Other"}
                       />
                   <Label onClick={(e) => this.setState({ selectedName: "Other", selectedId: '' })}>
                     Other
                   </Label>
                </Option>
                <TextInput type="text"
                       placeholder="Your preference"
                       value={this.state.newOptionName}
                       onChange={(e) => this.setState({
                         newOptionName: e.target.value,
                         selectedName: "Other",
                         selectedId: ''
                       })}
                       onClick={(e) => this.setState({ selectedName: "Other", selectedId: '' })}/>
              </span>
            }
            </PollOptions>
              <PollButton disabled={!this.state.selectedName || this.state.userHasVoted} onClick={this.verifyVote}>
                Vote!
              </PollButton>
          </PollContainer>
        </Card>
      </FlexContainer>
    );
  }
}

export default Poll;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Card = styled.div`
  width: 500px;
  min-height: 400px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.2);
  margin: 0 0 60px 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

const TitleContainer = styled.div`
  text-align: center;
  padding-bottom: 10px;
`;

const PollName = styled.h1`
  font-weight: 400;
  font-size: 2rem;
  margin: 0;
  ${'' /* padding-bottom: 10px; */}
  line-height: 2rem;
  flex: 0;
  color: white;
  text-decoration: none;
`;

const PollCreator = styled.p`
  color: white;
  opacity: 0.8;
  font-size: 1.25rem;
  line-height: 1.5rem;
  margin: 1rem;
`;

const PollButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background: dodgerblue;
  color: white;
  flex: 0 0 40px;
  font-size: 1.25rem;
  border: none;
  cursor: pointer;

  &:disabled {
    background: #999;

    &:hover {
      cursor: not-allowed;
    }
  }
`;

const PollOptions = styled.ul`
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  flex: 1;
  font-size: 1.25rem;
  overflow-y: auto;
`;

const Option = styled.li`
  padding: 2px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RadioInput = styled.input`
  padding: 5px;
`;

const TextInput = styled.input`
  padding: 2px;
  margin-left: 20px;
  border: 1px solid transparent;
  border-bottom: 1px solid #333;
  font-size: 1.25rem;
  line-height: 1.5rem;
  color: #333;
  width: 250px;
`;

const Label = styled.label`
  padding: 5px;
`;

const OptionCreator = styled.span`
  padding-left: 10px;
  opacity: 0.5;
  font-size: 70%;
`;
