import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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

    return (
      <Card>
        <PollName to={`/polls/${poll._id}`}>{`${poll.title} (${poll.totalVotes})`}</PollName>
      </Card>
    );
  }
}

export default Poll;

const Card = styled.div`
  width: 500px;
  height: 500px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.2);
  margin: 0 20px 0 0;

  &:last-of-type {
    margin-right: 0;
  }
`;

const PollName = styled(Link)`
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  line-height: 1.75rem;
  flex: 0;
  padding-bottom: 10px;
  color: #333;
  text-decoration: none;
`;

const PollButton = styled.button`
  ${'' /* padding: 10px 20px; */}
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
  overflow-y: auto;
`;

const Option = styled.li`
  padding: 5px 0;
`;

const RadioInput = styled.input`
  padding: 5px;
`;

const TextInput = styled.input`
  padding: 2px;
  margin-left: 20px;
  border: 1px solid transparent;
  border-bottom: 1px solid #333;
  font-size: 1rem;
  color: #333;
  width: 250px;
`;

const Label = styled.label`
  padding: 5px;
`;

const PollCreator = styled.span`
  padding-left: 10px;
  opacity: 0.5;
  font-size: 70%;
`;
