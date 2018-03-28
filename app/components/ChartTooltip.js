import React from 'react';
import styled from 'styled-components';

import colors from '../helpers/colors';

class ChartTooltip extends React.Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      return (
        <Tooltip>
          <Day>{label}</Day>
          { payload.map((item, i) => {
            return <Item key={item.name} color={colors[i]}>{`${item.name}: ${item.value}%`}</Item>
          })}
        </Tooltip>
      );
    }
    return null;
  }
}

export default ChartTooltip;

const Tooltip = styled.div`
  background: #143852;
  border: 1px solid #437294;
  height: auto;
  width: auto;
  padding: 10px;

`;

const Day = styled.p`
  color: white;
  margin: 0;
  padding: 3px 0;
  font-weight: bold;
`;

const Item = styled.p`
  color: ${props =>
    props.color || 'darkgray'
  };
  margin: 0;
  padding: 3px 0;
`;
