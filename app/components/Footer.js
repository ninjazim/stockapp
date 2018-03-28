import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

class Footer extends React.Component {

  render() {
    return (
      <FooterContainer hidden={this.props.isLoading}>
        <CreatorLink href='https://www.github.com/ninjazim'>
          created by <span>ninjazim</span>
        </CreatorLink>
        <Spacer><img src={'./public/img/logo2.png'} width={20} /></Spacer>
        <CreatorLink href='https://iextrading.com/developer/'>
          powered by <span>IEX</span>
        </CreatorLink>
      </FooterContainer>
    );
  }
}

export default Footer;

const FooterContainer = styled.div`
  width: 100%;
  height: 50px;
  color: #437294;
  padding: 10px 20px;
  box-sizing: border-box;
  text-align: center;
  font-size: 0.8rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px dashed #437294;
`;

const Spacer = styled.span`
  padding: 0 5px;
  color: #437294;
`;

const CreatorLink = styled.a`
  color: #437294;
  text-align: center;
  text-decoration: none;

  & span {
    text-decoration: underline;
  }
`
