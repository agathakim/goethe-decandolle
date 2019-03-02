import React from 'react';
import {XYPlot, LineSeries, XAxis, YAxis, HorizontalGridLines} from 'react-vis';
import {COLORS} from '../constants';

export default class TimeSeries extends React.Component {
  render() {
    const maxY = Object.values(this.props.data)
      .reduce((acc, row) => {
        return Math.max(acc, row.reduce((mem, {y}) => Math.max(y, mem), 0));
      }, 0);
    console.log(this.props.data)
    return (
      <XYPlot 
        width={600} 
        height={500} 
        yDomain={[1.1, maxY]}
        yType="log">
        <XAxis />
        <YAxis tickFormat={d => d}/>
        <HorizontalGridLines/>
        {Object.entries(this.props.data)
            .filter(([key, series]) => key !== 'INDEX')
            .map(([cat, series]) => <LineSeries 
              color={COLORS[cat]}
              data={series.map(d => {
                return {...d, y: d.y + 1};
              })} 
              key={cat}/>)}
      </XYPlot>
    );
  }
}
