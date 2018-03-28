import React from 'react';
import styled from 'styled-components';
import transition, { css } from "styled-transition-group";
import { TransitionGroup } from "react-transition-group"

class Message extends React.Component {

  render() {
    let message = this.props.message;
    return (
      <Container hidden={message.text == ''} color={message.color}>
        {message.text}
      </Container>
    );
  }
}

export default Message;

const Container = styled.div`
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  background: ${props =>
    (props.color == 'red' && '#EB5757') ||
    (props.color == 'yellow' && '#F2C94C') ||
    (props.color == 'green' && '#27AE60') ||
    'none'
  };
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  top: ${props =>
    (props.hidden == true && '-40px') || '0'
  };
  transition: 0.5s;
`;
