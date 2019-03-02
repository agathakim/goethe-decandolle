import React from 'react';
import {XYPlot, LineSeries, XAxis, YAxis} from 'react-vis';

export default class TimeSeries extends React.Component {
  render() {
    return (
      <XYPlot width={800} height={400} >
        <XAxis />
        <YAxis />
        {Object.entries(this.props.data)
            .map(([cat, series]) => <LineSeries data={series} key={cat}/>)}
      </XYPlot>
    );
  }
}
