import React from 'react';
import {XYPlot, LineSeries, XAxis, YAxis, HorizontalGridLines} from 'react-vis';
import {COLORS} from '../constants';

export default class TimeSeries extends React.Component {
  render() {
    const maxY = Object.entries(this.props.data)
      .filter(([key, series]) => key !== 'index')
      .reduce((acc, [key, row]) => {
        return Math.max(acc, row.reduce((mem, {y}) => Math.max(y, mem), 0));
      }, 0);
    return (
      <XYPlot 
        width={600} 
        height={500} 
        yDomain={[1.1, maxY]}
        yType="log">
        <XAxis />
        <YAxis tickFormat={d => d - 1} 
        tickValues={[
          // the weirdness of this of this enumeration is bc i needed to index
          // all of the values up an order of magnitude to log scale it
          2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
          21, 31, 41, 51, 61, 71, 81, 91, 101,
          201, 301
        ]}
        />
        <HorizontalGridLines/>
        {Object.entries(this.props.data)
            .filter(([key, series]) => key !== 'index')
            .map(([cat, series]) => <LineSeries 
              color={COLORS[cat]}
              data={series.map(d => ({...d, y: d.y + 1}))} 
              key={cat}/>)}
      </XYPlot>
    );
  }
}
