import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import transition, { css } from "styled-transition-group";
import { TransitionGroup } from "react-transition-group"

import axios from 'axios';

class Tickers extends React.Component {
  constructor() {
    super();
    this.state = {
      newTicker: '',
      invalidInput: false,
      timeframes: ['1m', '3m', '6m', '1y']
    }
  }

  handleKeyPress(e) {
    if (e.keyCode == 13) {
      let filtered = this.props.tickers.filter((ticker) => {
        return ticker.symbol == this.state.newTicker;
      });
      if (this.state.invalidInput) {
        this.props.updateMessage({color: 'red', text: `${this.state.newTicker} is not a valid stock symbol`});
      } else if (filtered.length == 0 && !this.state.invalidInput) {
        axios.get(`https://api.iextrading.com/1.0/stock/${this.state.newTicker}/quote`)
             .then(response => {
               if(response.status == 200) {
                 this.props.addTicker(response.data);
                 this.props.updateMessage({color: 'green', text: `Added ${this.state.newTicker}`});
                 this.setState({ newTicker: ''});
               } else {
                 this.setState({ invalidInput: true });
               }
             })
             .catch(error => {
               this.setState({ invalidInput: true });
               this.props.updateMessage({color: 'red', text: `${this.state.newTicker} is not a valid stock symbol`});
             });
      } else {
        this.setState({ invalidInput: true });
        this.props.updateMessage({color: 'yellow', text: `${this.state.newTicker} is already being tracked`});
      }
    }
  }

  render() {
    return (
      <Container>
        <SearchRow>
            <Search red={this.state.invalidInput ? 'true' : ''}
                    disabled={this.props.tickers.length >= 8}>
              <input type="text"
                     disabled={this.props.tickers.length >= 8}
                     placeholder="Add a Symbol"
                     value={this.state.newTicker}
                     onKeyDown={(e) => this.handleKeyPress(e) }
                     onChange={(e) => this.setState({ newTicker: e.target.value.toUpperCase(), invalidInput: false })} />
            </Search>
          <ButtonGroup>
            {this.state.timeframes.map((timeframe, i) => {
            return  (<Button key={i}
                      selected={this.props.selectedTimeframe == timeframe}
                      onClick={()=> {this.props.updateTimeframe(timeframe)}}>
                      {timeframe}
              </Button>)
            })}
          </ButtonGroup>
        </SearchRow>
        <TransitionGroup style={groupStyle}>
          {this.props.tickers.map((ticker, i) => {
            return (
              <FadeDiv in={!!ticker} key={ticker.symbol}>
                <Ticker index={i}>
                  <Details>
                    <p>{ticker.symbol}</p>
                    <span>{ticker.name}</span>
                  </Details>

                  <span onClick={() => this.props.removeTicker(ticker)}>×</span>
                </Ticker>
              </FadeDiv>
            );
          })}

        </TransitionGroup>
      </Container>
    );
  }
}

export default Tickers;

const groupStyle = {
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'wrap',
  'justifyContent': 'center',
}

const FadeDiv = transition.div.attrs({
  unmountOnExit: true,
  timeout: 250
})`
  &:enter { opacity: 0.01; }
  &:enter-active {
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  &:exit { opacity: 1; }
  &:exit-active {
    opacity: 0.01;
    transition: opacity 0.5s ease;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  width: 300px;
  justify-content: space-between;
  margin: 0 10px 30px;
`;

const Button = styled.button`
  border: 2px solid ${props =>
    (props.selected == true && 'rgba(255,255,255,0.7)') ||
    '#437294'
  };
  border-radius: 60px;
  background: ${props =>
    (props.selected == true && 'rgba(255,255,255,0.1)') || 'none'
  };
  height: 60px;
  width: 60px;
  box-sizing: border-box;
  color: ${props =>
    (props.selected == true && 'rgba(255,255,255,0.7)') ||
    '#437294'
  };
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  font-size: 1rem;
  text-transform: uppercase;

  &:focus {
    outline: none;
  }


  &:hover {
    cursor: pointer;
    background-color: rgba(255,255,255,0.1);
    color: white;

  }
`;


const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 40px;
`;

const SearchRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const Ticker = styled.div`
  width: 300px;
  height: 60px;
  padding: 10px;
  box-sizing: border-box;
  margin: 0 10px 10px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 2px solid ${props =>
    (props.index == '0' && '#BB6BD9') ||
    (props.index == '1' && '#56CCF2') ||
    (props.index == '2' && '#27AE60') ||
    (props.index == '3' && '#F2C94C') ||
    (props.index == '4' && '#F2994A') ||
    (props.index == '5' && '#EB5757') ||
    (props.index == '6' && '#9B51E0') ||
    (props.index == '7' && '#1F8FA8') ||
    '#437294'
  };

  & span {
    color: ${props =>
      (props.index == '0' && '#BB6BD9') ||
      (props.index == '1' && '#56CCF2') ||
      (props.index == '2' && '#27AE60') ||
      (props.index == '3' && '#F2C94C') ||
      (props.index == '4' && '#F2994A') ||
      (props.index == '5' && '#EB5757') ||
      (props.index == '6' && '#9B51E0') ||
      (props.index == '7' && '#1F8FA8') ||
      'darkgray'
    };
    opacity: 0.8;

    &:hover {
      cursor: pointer;
    }
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  & p {
    line-height: 1.5rem;
    margin: 0;
  }
`

  const Search = Ticker.extend`
    border: 2px solid rgba(255,255,255,0.7);
    padding: 0;
    border-radius: 60px;
    transition: opacity 0.3s ease;
    opacity: ${props =>
      (props.disabled && '0.25') || '1'
    };
    position: relative;

    & input {
      width: 100%;
      height: 100%;
      border: 2px solid #437294;
      background: none;
      border-radius: 60px;
      border: none;
      font-size: 1.2rem;
      padding: 10px;
      box-sizing: border-box;
      text-transform: uppercase;
      text-align: center;
      color: ${props =>
        (props.red == 'true' && '#EB5757') || 'white'
      };

      &::placeholder {
        color: rgba(255,255,255,0.2);
      }

      &:focus {
        outline: none;
        background: rgba(255,255,255,0.1);

      }
      &:disabled {
        cursor: not-allowed;
      }
    }

    & span {
      position: absolute;
      right: 18px;
      font-size: 1.5rem;
      color: rgba(255,255,255,0.7);
      margin: 0;
    }
`;

const SearchBox = styled.div`
  width: 100%;
  height: 50px;
  background: rgba(0,0,0,0.1);
  margin: 20px 0;

  & input {
    width: 100%;
    height: 100%;
    background: none;
    border: none;
    color: ${props =>
      (props.red == 'true' && '#EB5757') || 'white'
    };
    font-size: 2rem;
    padding: 10px;
    box-sizing: border-box;
    text-transform: uppercase;
    text-align: center;

    &:focus {
      outline: none;
    }
  }
`;
