import React from 'react';
import {XYPlot, XAxis, VerticalBarSeries, YAxis} from 'react-vis';
import {WAFFLE_WIDTH} from '../constants';

export default class Radial extends React.Component {
  render() {
    const {data} = this.props;
    const barData = data.map(({tag, count, color}) => ({
      // y: cat,
      // x: count,
      y: count,
      x: tag,
      color,
    }));
    return (
      <XYPlot
        height={200}
        width={WAFFLE_WIDTH}
        xType="ordinal"
        colorType="literal"
      >
        <XAxis className="bar-chart-x-axis" />
        <VerticalBarSeries data={barData} />
        <YAxis />
      </XYPlot>
    );
  }
}
