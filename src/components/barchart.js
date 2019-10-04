import React from 'react';
import {XYPlot, XAxis, HorizontalBarSeries, YAxis} from 'react-vis';
import {WAFFLE_WIDTH} from '../constants';

export default class Radial extends React.Component {
  render() {
    const {data} = this.props;
    const barData = data.map(({cat, count, color}) => ({
      y: cat,
      x: count,
      color,
    }));
    return (
      <XYPlot
        height={200}
        width={WAFFLE_WIDTH}
        margin={{top: 20, left: 200, right: 20, bottom: 20}}
        yType="ordinal"
        colorType="literal"
      >
        <XAxis />
        <HorizontalBarSeries data={barData} />
        <YAxis
          style={{
            text: {
              fontSize: 8,
              textAnchor: 'end',
            },
          }}
        />
      </XYPlot>
    );
  }
}
