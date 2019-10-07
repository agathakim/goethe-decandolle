import React from 'react';
import {Treemap} from 'react-vis';
import {WAFFLE_WIDTH} from '../constants';

export default class StackedBarChart extends React.Component {
  render() {
    const {data} = this.props;
    console.log(data);
    return (
      <Treemap
        getSize={d => {
          return d.count;
        }}
        colorType="literal"
        width={WAFFLE_WIDTH}
        height={75}
        mode="dice"
        data={{
          color: 'rgba(255, 255, 255, 0)',
          children: data.map(d => ({...d})).sort((a, b) => b.count - a.count),
        }}
      />
    );
  }
}
