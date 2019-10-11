import React from 'react';
import {XYPlot, XAxis, VerticalBarSeries, YAxis} from 'react-vis';
import {WAFFLE_WIDTH} from '../constants';

export default class BarChart extends React.Component {
  render() {
    const barData = this.props.data.map(({tag, count, color}) => ({
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
