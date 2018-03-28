import React from 'react';

class ChartXAxis extends React.Component {
  render () {
    const {x, y, stroke, payload} = this.props;
   	return (
    	<g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={5} textAnchor="start" fill="#437294" fontSize={10} transform="rotate(45)">{payload.value}</text>
      </g>
    );
  }
}

export default ChartXAxis;
