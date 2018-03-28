import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
import axios from 'axios';

import colors from '../helpers/colors';
import ChartTooltip from './ChartTooltip';
import ChartXAxis from './ChartXAxis';

class Chart extends React.Component {

  roundData(d) {
    return Math.round(d * 100 * Math.pow(10, 2)) / Math.pow(10, 2);
  }

  render() {
    let first = [];
    let data = [];
    if (this.props.rawData.length > 0) {
      first = this.props.rawData[0].data;
      data = first.map((item, i) => {
        let point = {};
        point.date = new Date(item.date).toLocaleDateString();
        this.props.rawData.forEach((company, c) => {
          if (company.data[i]) {
            point[company.symbol] = this.roundData(company.data[i].changeOverTime);
          }
        });
      return point;
      });
    } else {
      return (
        <EmptyContainer>
          {!this.props.isLoading &&
            <p>Enter a stock symbol in the box below to see % change over time</p>
          }
        </EmptyContainer>
      )
    }
    return (
      <Container>
        <Title>{`Percent Change Since ${data[0].date} (${this.props.selectedTimeframe})`}</Title>
        <ResponsiveContainer width='100%' height={600} >
          <LineChart data={data} margin={{ top: 5, right: 60, bottom: 5, left: 5} } >
            <YAxis stroke="#437294"
                   type="number"
                   interval={0}
                   domain={[-50, 50]}
                   tickLine={false}
                   padding={{ top: 5, bottom: 5 }} >
            </YAxis>
            <XAxis dataKey="date"
                   stroke="#437294"
                   height={50}
                   interval={"preserveStartEnd"}
                   minTickGap={0}
                   tick={<ChartXAxis />}
                   tickSize={5} />
            {this.props.tickers.map((company, i) => {
              let color = colors[i];
              return (
                <Line key={company.symbol}
                      type="monotone"
                      dot={false}
                      strokeWidth="2"
                      dataKey={company.symbol}
                      stroke={color} />
                    )
            })}
            <Tooltip payload={data} content={<ChartTooltip />} />
          </LineChart>
        </ResponsiveContainer>
      </Container>
    );
  }
}

export default Chart;

const Container = styled.div`
  margin-top: 20px;
  width: 100%;
  min-height: 600px;
  box-sizing: border-box;
  color: white;
`;

const EmptyContainer = Container.extend`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & p {
    color: gray;
  }
`;

const Title = styled.p`
  text-align: center;
  color: #437294;
  margin: 0;
  padding: 0 0 30px;
  text-transform: uppercase;
`;
