import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import styled from 'styled-components';
import axios from 'axios';

import Polls from './pages/Polls';
import CreatePoll from './pages/CreatePoll';
import ViewPoll from './pages/ViewPoll';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Header from './components/Header';
import AllPolls from './pages/AllPolls';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      isLoggedIn: false
    }
  }

  componentWillMount() {
    axios.get(`/api/user`)
      .then(response => {
        let user = response.data;
        let isLoggedIn = false;
        if (Object.keys(user).length > 0) {
          isLoggedIn = true;
        }
        this.setState({
          user,
          isLoggedIn
        });
      });
  }

  render () {
    let { user, isLoggedIn } = this.state;

    return (
      <BrowserRouter>
        <div>
          <Header user={user} isLoggedIn={isLoggedIn} />
          <Route exact path="/" render={() => (
            <Redirect to={{
              pathname: '/polls/',
              state: { from: '/' }
            }}/>
          )} />
          <Switch>
            <Route exact path="/polls/new" render={(props) => <CreatePoll user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props} /> } />
            <Route exact path="/polls/all" render={(props) => <AllPolls {...props} /> } />
            <Route path="/polls/:id" render={(props) => <ViewPoll user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props}/> } />
            <Route exact path="/polls/" render={(props) => <Polls {...props} /> } />
          </Switch>
          <Switch>
            <Route path="/profile/:username" render={(props) => <Profile user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props} /> } />
            <Route path="/profile" render={(props) => <MyProfile user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props} /> } />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

render(<App/>, document.getElementById('app'));
