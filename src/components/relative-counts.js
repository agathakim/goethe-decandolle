import React from 'react';
import {COLORS_FOR_LEGEND} from '../constants';

const COLORS_TO_LABELS = COLORS_FOR_LEGEND.reduce((acc, row) => {
  acc[row.color] = row.label;
  return acc;
}, {});

function axisSelect(axisName, currentVal, onSelect) {
  return (
    <div>
      {axisName}
      <select
        value={currentVal}
        onChange={({target: {value}}) => onSelect(value)}
      >
        <option value={''}>None</option>
        {COLORS_FOR_LEGEND.map(({label, color}) => (
          <option value={color} key={`${axisName}-${label}`}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default class RelativeCounts extends React.Component {
  constructor() {
    super();
    this.state = {
      xAxis: '',
      yAxis: '',
    };
  }

  render() {
    const {data} = this.props;
    const {xAxis, yAxis} = this.state;
    // const cleanedData = data.filter(({label, colors}) => {
    //   const hasXAxis = colors.includes(xAxis);
    //   return hasXAxis && colors.length > 1;
    // }).reduce(());
    // console.log(data, cleanedData);

    return (
      <div>
        {axisSelect('x axis', xAxis, val => this.setState({xAxis: val}))}
        {axisSelect('y axis', yAxis, val => this.setState({yAxis: val}))}
        {COLORS_TO_LABELS[xAxis]}
        {COLORS_TO_LABELS[yAxis]}
      </div>
    );
  }
}
