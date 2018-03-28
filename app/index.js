import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

import styled from 'styled-components';
import axios from 'axios';
import io from 'socket.io-client';

import Message from './components/Message';
import Chart from './components/Chart';
import Tickers from './components/Tickers';
import Footer from './components/Footer';

let ws = new WebSocket(`ws://localhost:40510`);

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tickers: [],
      message: {
        color: '',
        text: '',
      },
      rawData: [],
      startDate: '',
      timeout: '',
      selectedTimeframe: '3m',
      isLoading: true,
    }
    this.removeTicker = this.removeTicker.bind(this);
    this.addTicker = this.addTicker.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
    this.updateTimeframe = this.updateTimeframe.bind(this);
  }

  removeTicker(t) {
    axios.delete(`/api/stocks/${t.symbol}`)
         .then(response => {
           let message = {
             type: 'removed',
             symbol: t.symbol,
             name: t.name,
           };
           this.state.ws.send(JSON.stringify(message));
           if(response.data.deleted && (response.data.symbol == t.symbol)) {
             let filteredTickers = this.state.tickers.filter((ticker) => {
               return ticker.symbol !== t.symbol;
             });
             let filteredRaw = this.state.rawData.filter((raw) => {
               return raw.symbol !== t.symbol;
             });
             this.setState({
               tickers: filteredTickers,
               rawData: filteredRaw,
             });
           }
         })
         .catch(error => {
           console.log(error);
         });
  }

  handleMessage(m) {
    let data = JSON.parse(m.data);
    let notification = {};
    if (data.type == 'added' || data.type == 'removed') {
      // console.log(m.data);
      let tickers = this.state.tickers.slice();
      let filtered = tickers.filter((ticker) => {
        return ticker.symbol == data.symbol;
      });
      if (filtered.length == 0 && data.type == 'added') {
        tickers.push({
          symbol: data.symbol,
          name: data.name,
        });
        this.setState({
          tickers
        });
        notification = {
          color: 'yellow',
          text: `Someone added ${data.symbol}.`
        };
        this.updateMessage(notification);
        this.getTickerData(data.symbol, this.state.selectedTimeframe);
      } else if (filtered.length > 0 && data.type == 'removed') {
        let filteredTickers = this.state.tickers.filter((ticker) => {
          return ticker.symbol !== data.symbol;
        });
        let filteredRaw = this.state.rawData.filter((raw) => {
          return raw.symbol !== data.symbol;
        });
        this.setState({
          tickers: filteredTickers,
          rawData: filteredRaw,
        });
        notification = {
          color: 'yellow',
          text: `Someone removed ${data.symbol}.`
        };
        this.updateMessage(notification);
      }
    }
    // console.log(data);
  };

  getTickerData(ticker, timeframe = '3m') {
    axios.get(`https://api.iextrading.com/1.0/stock/${ticker}/chart/${timeframe}`)
         .then(response => {
           let rawData = [];
           if (this.state.rawData.length > 0) {
             rawData = this.state.rawData.filter((t) => {
               return t.symbol !== ticker;
             });
           }
           let newData = {
             symbol: ticker,
             data: response.data
           }
           if (response.data.length == 0) {
             this.updateMessage({ color: 'yellow', text: `No historical data for ${ticker}. Removing...`});
             setTimeout(() => {
               this.removeTicker({symbol: ticker});
             }, 3000);

           }
           rawData.push(newData);
           this.setState({
             rawData
           });
         })
         .catch(error => {
           this.updateMessage({ color: 'red', text:`Could not get data for ${ticker}. Try adding again.`});
           this.removeTicker(ticker);
         });
  }

  addTicker(t) {
    if (this.state.tickers.length < 8) {
      let ticker = {
        symbol: t.symbol,
        name: t.companyName
      };
      console.log("adding", t.symbol);
      axios.post(`/api/stocks`,ticker)
           .then(response => {
             let message = {
               type: 'added',
               symbol: ticker.symbol,
               name: ticker.name,
             };
             this.state.ws.send(JSON.stringify(message));
             let updated = this.state.tickers.slice();
             updated.push({
               symbol: response.data.symbol,
               name: response.data.name
             });
             this.setState({
               tickers: updated
             });
             this.getTickerData(t.symbol, this.state.selectedTimeframe);
           })
           .catch(error => {
             console.log(error);
           });
    }
  }

  updateMessage(m) {
    clearTimeout(this.state.timeout);
    let clearMessage = setTimeout(() => {
      this.setState({
        message: {
          color: '',
          text: '',
        }
      });
    }, 3000);
    this.setState({
      message: {
        color: m.color,
        text: m.text,
      },
      timeout: clearMessage,
    });
  }

  updateTimeframe(timeframe) {
    this.setState({
      selectedTimeframe: timeframe,
    });
    this.state.tickers.forEach((ticker) => {
      this.getTickerData(ticker.symbol, timeframe);
    });
  }

  componentDidMount() {
    axios.get(`/api/stocks`)
         .then(response => {
           let tickers = response.data.map((ticker) => {
             return ({
               symbol: ticker.symbol,
               name: ticker.name,
             })
           });
           this.setState({
             tickers,
             isLoading: false,
           });
           tickers.forEach((ticker) => {
             this.getTickerData(ticker.symbol);
           });
         })
         .catch(error => {
           console.log(error);
         });
    // event emmited when connected
    this.setState({
      ws
    });
    ws.onopen = function () {
      console.log('websocket is connected ...')
      // sending a send event to websocket server
      let message = {
        type: 'connected',
      }
      ws.send(JSON.stringify(message));
    }

    ws.onmessage = this.handleMessage.bind(this);
  }

  componentWillUnmount() {
    this.state.ws.close();
  }

  render () {

    return (
      <BrowserRouter>
        <div>
          <Message message={this.state.message}
                   updateMessage={this.updateMessage} />
              <Chart rawData={this.state.rawData}
                     tickers={this.state.tickers}
                     isLoading={this.state.isLoading}
                     selectedTimeframe={this.state.selectedTimeframe} />
              <div style={{'margin': '0px 40px 40px'}}>
              <Tickers tickers={this.state.tickers}
                       removeTicker={this.removeTicker}
                       addTicker={this.addTicker}
                       updateMessage={this.updateMessage}
                       updateTimeframe={this.updateTimeframe}
                       selectedTimeframe={this.state.selectedTimeframe} />
            </div>
            <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

render(<App/>, document.getElementById('app'));
