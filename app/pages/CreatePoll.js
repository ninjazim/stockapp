import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Poll from '../components/Poll';

class CreatePoll extends React.Component {
  constructor() {
    super();
    this.state = {
      _id: '',
      title: "",
      options: [
        {
          name: ""
        },
        {
          name: ""
        }
      ]
    };

    this.updateOptionName = this.updateOptionName.bind(this);
    this.addOption = this.addOption.bind(this);
    this.verifyPollData = this.verifyPollData.bind(this);
    this.savePoll = this.savePoll.bind(this);
  }

  savePoll(poll) {
    axios.post(`/api/polls`, poll)
      .then(response => {
        this.setState({
          _id: response.data._id
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  verifyPollData() {
    let poll = Object.assign({},this.state);
    let filteredOptions = poll.options.filter((option) => {
      return option.name && option.name.trim().length > 0
    });
    poll.options = filteredOptions;
    this.savePoll(poll);
  }

  addOption() {
    let options = this.state.options.slice();
    options.push({
      name: ""
    });
    this.setState({
      options
    });
  }

  updateOptionName(e,i) {
    let options = this.state.options.slice();
    options[i].name = e.target.value;
    this.setState({
      options
    });
  }

  render () {
    if (this.state._id) {
      return <Redirect to={{
        pathname: `/polls/${this.state._id}`,
        state: { from: '/polls/new' }
      }}/>
    }
    return (
      <div>
        <Section green>
        </Section>
        <Section>
          <Container>
            <SectionTitle>
              Create A Poll
            </SectionTitle>
            <PollContainer>
              <Card>
                <Label>Title:</Label>
                <TextInput type="text"
                       placeholder="Poll Title"
                       value={this.state.title}
                       onChange={(e) => this.setState({title: e.target.value})} />
                <PollOptions>
                  {this.state.options.map((option, i) => {
                    return (
                      <div key={i}>
                        <Label>{`Option ${i+1}:`}</Label>
                        <TextInput type="text"
                               id={`option-${i}`}
                               placeholder="Enter some text"
                               value={option.name}
                               onChange={ (e) => this.updateOptionName(e,i) } />
                      </div>
                    )
                  })}
                  <AddOption onClick={() => this.addOption()}>
                    Add Option
                  </AddOption>
                </PollOptions>
                <PollButton onClick={ () => this.verifyPollData() }>
                  Create Poll
                </PollButton>
              </Card>
              {/* <Poll poll={this.state} /> */}

            </PollContainer>
          </Container>
        </Section>
      </div>
    );
  }
}

export default CreatePoll;

const Section = styled.div`
  width: 100%;
  min-height: 400px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props =>
    (props.green && 'MEDIUMSEAGREEN')
    || '#eee'
  };
  box-sizing: border-box;
`;

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: -300px;
`;

const SectionTitle = styled.h1`
  color: white;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  padding: 0 0 20px;
  text-align: center;
`;

const PollContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  width: auto;
  margin: 0 20px;
`;

const Card = styled.div`
  min-width: 500px;
  min-height: 400px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.2);
  margin: 10px;
`;

const PollName = styled.h1`
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  line-height: 2.5rem;
  flex: 0;
  padding-bottom: 10px;
`;

const PollButton = styled.button`
  ${'' /* padding: 10px 20px; */}
  border-radius: 5px;
  border: none;
  background: MEDIUMSEAGREEN;
  color: white;
  flex: 0 0 40px;
  font-size: 1.25rem;
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
  padding: 2px 0;
  border: none;
  border-bottom: 1px solid #aaa;
  font-size: 1rem;
  color: #333;
  width: 100%;
  margin-bottom: 10px;
  font-size: 1.2rem;
  line-height: 1.75rem;

  &:focus {
    outline: none;
    border-bottom: 1px solid seagreen;
    background-color: #fcfcfc;
    te

  }
`;

const AddOption = styled.button`
  padding: 10px;
  margin: 5px 0 20px;
  background: #eee;
  border: none;
  outline: none;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
  }
`;

const Label = styled.p`
  font-size: .8rem;
  color: #aaa;
  margin-bottom: 5px;

`;
