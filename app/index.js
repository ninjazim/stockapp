import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import { BASE_URL } from './config/config';
import styled from 'styled-components';
import axios from 'axios';

import Polls from './pages/Polls';
import CreatePoll from './pages/CreatePoll';
import ViewPoll from './pages/ViewPoll';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Header from './components/Header';
import Poll from './components/Poll';
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
    axios.get(`${BASE_URL}/api/user`)
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
            <Route exact path="/polls/new" render={(props) => <CreatePoll {...props} /> } />
            <Route exact path="/polls/all" render={(props) => <AllPolls {...props} /> } />
            <Route path="/polls/:id" render={(props) => <ViewPoll user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props}/> } />
            <Route exact path="/polls/" render={(props) => <Polls {...props} /> } />
          </Switch>
          <Switch>
            <Route path="/profile/:username" render={(props) => <Profile user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props} /> } />
            <Route path="/profile" render={(props) => <MyProfile user={this.state.user} isLoggedIn={this.state.isLoggedIn} {...props} /> } />
          </Switch>

            {/* if (this.state.isLoggedIn) {
              return <CreatePoll user={user}/>
            } else {
              return <Redirect to={{
                        pathname: '/login',
                        state: { from: '/polls/new' }
                      }}/>
            }
          }} /> */}
          <Route path="/login" component={Login}/>
          <Route path="/poll" component={Poll}/>

        </div>
      </BrowserRouter>
    );
  }
}

render(<App/>, document.getElementById('app'));
