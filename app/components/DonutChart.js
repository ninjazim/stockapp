import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import {Doughnut, defaults} from 'react-chartjs-2';

defaults.global.backgroundCol

class DonutChart extends React.Component {
  constructor() {
    super();
    this.state = {

    };

    this.getVotes = this.getVotes.bind(this);
    this.getLabels = this.getLabels.bind(this);
  }

  getVotes(options) {
    if (options.length > 6) {
      let reducedOptionVotes = [];
      let otherOptionVotes = 0;

      for (let i in options) {
        if (i < 5) {
          reducedOptionVotes.push(options[i].votes);
        } else {
          otherOptionVotes += options[i].votes;
        }
      }
      reducedOptionVotes.push(otherOptionVotes);
      return reducedOptionVotes;
    } else {
      let allOptionVotes = options.map((option) => {
        return option.votes;
      });
      return allOptionVotes;
    }
  }

  getLabels(options) {
    if (options.length > 6) {
      let reducedOptionLabels = [];
      for (let i in options) {
        if (i < 5) {
          reducedOptionLabels.push(options[i].name);
        }
      }
      reducedOptionLabels.push("Other");
      return reducedOptionLabels;
    } else {
      let allOptionNames = options.map((option) => {
        return option.name;
      });
      return allOptionNames;
    }
  }

  render () {

    let poll = this.props.poll;

    if (!poll) {
      return <ChartContainer />
    }

    let options = poll.options.sort((a,b) => {
      if (a.votes < b.votes) { return 1 }
      else if (a.votes > b.votes) { return -1 }
      else { return 0 }
    });

    let chartData = {
      labels: this.getLabels(options),
      datasets: [{
        data: this.getVotes(options),
        backgroundColor: [
          'RGBA(70, 130, 180, 0.9)', // STEELBLUE
          'RGBA(255, 99, 71, 0.9)', // TOMATO
          'RGBA(60, 179, 113, 0.9)', // MEDIUMSEAGREEN
          'RGBA(255, 165, 0, 0.9)', // ORANGE
          'RGBA(147, 112, 219, 0.9)', // MEDIUMPURPLE
          'RGBA(128, 128, 128, 0.9)', // GRAY
         ],
         borderColor: 'transparent',
         borderWidth: 0,
         hoverBackgroundColor: [
           'RGBA(70, 130, 180, 1)', // STEELBLUE
           'RGBA(255, 99, 71, 1)', // TOMATO
           'RGBA(60, 179, 113, 1)', // MEDIUMSEAGREEN
           'RGBA(255, 165, 0, 1)', // ORANGE
           'RGBA(147, 112, 219, 1)', // MEDIUMPURPLE
           'RGBA(128, 128, 128, 1)', // GRAY
         ],
      }]

    }
    return (
      <ChartBox>
        <Doughnut data={chartData}
                  width={500}
                  height={300}
                  options={{
                		maintainAspectRatio: true,
                    responsive: true,
                    legend: {
                      display: false,
                      position: 'bottom',
                      labels: {
                        fontFamily: 'Helvetica',
                        padding: 20,
                        fontColor: '#333'
                      },
                    },
                    tooltips: {
                      displayColors: false,
                      backgroundColor: 'rgba(50,50,50,0.5)',
                    },
                	}}/>
      </ChartBox>
    );
  }
}

export default DonutChart;

const ChartBox = styled.div`
  width: auto;
  height: auto;
  background-color: lightgray;
  padding: 30px;
`;

const ChartContainer = styled.div`
  max-width: 80%;
  margin: auto;
  background-color: #eee;
  padding: 20px;
`;
