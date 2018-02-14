import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

class Header extends React.Component {

  render() {
    const user = this.props.user;
    return (
      <HeaderContainer>
        <Title to='/polls'>Poll'd</Title>
        { !this.props.isLoggedIn &&
        <ButtonALink
          href={`/auth/github`}
          onClick={this.getUser}>
            Sign in with Github
        </ButtonALink>
        }
        { this.props.isLoggedIn &&
          <MenuItems>
            <ButtonLink to={'/polls/new'}>Create a Poll</ButtonLink>
            <UserLink to={`/profile`}>{user.username}</UserLink>
          </MenuItems>
        }
      </HeaderContainer>
    );
  }
}

export default Header;

const HeaderContainer = styled.div`
  width: 100%;
  height: 60px;
  background: #333;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 10px 20px;
  box-sizing: border-box;
`;

const Title = styled(Link)`
  color: white;
  font-weight: 400;
  font-size: 1.5rem;
  margin: 0;
  line-height: 2.5rem;
  text-decoration: none;
`;

const UserLink = styled(Link)`
  padding: 10px 20px;
  border-radius: 5px;
  background: gray;
  color: white;
  margin: 0 0 0 10px;
  text-decoration: none;
`;

const MenuItems = styled.div`
`;

const ButtonLink = styled(Link)`
  padding: 10px 20px;
  border-radius: 5px;
  background: MEDIUMSEAGREEN;
  color: white;
  margin: 0 0 0 10px;
  text-decoration: none;
`;

const ButtonALink = styled.a`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${props =>
    (props.red && 'tomato')
    || (props.green && 'MEDIUMSEAGREEN')
    || 'gray'
  };
  color: white;
  text-decoration: none;
  margin: 0;
`;
