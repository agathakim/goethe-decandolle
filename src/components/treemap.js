import React from 'react';
import {Treemap} from 'react-vis';
import {scaleLinear} from 'd3-scale';
import {WAFFLE_WIDTH} from '../constants';

export default class StackedBarChart extends React.Component {
  render() {
    const {data} = this.props;
    const margin = {top: 0, left: 40, right: 10, bottom: 0};
    const sum = data.reduce((acc, {count}) => acc + count, 0);
    const xScale = scaleLinear()
      .domain([0, sum])
      .range([0, WAFFLE_WIDTH - margin.left - margin.right]);
    let offset = 0;
    const rects = data
      .map(d => ({...d}))
      .sort((a, b) => b.count - a.count)
      .map(d => {
        const newRow = {
          x: offset,
          width: d.count,
          color: d.color,
          node: d,
        };
        offset += d.count;
        return newRow;
      });
    return (
      <svg height={30} width={WAFFLE_WIDTH} className="stacked-bar-chart">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {rects.map(rect => {
            return (
              <rect
                key={`${rect.node.tag}-bar`}
                fill={rect.color}
                height="30"
                width={xScale(rect.width)}
                x={xScale(rect.x)}
                y="0"
              />
            );
          })}
        </g>
      </svg>
    );
    // return (
    //   <Treemap
    //     getSize={d => {
    //       return d.count;
    //     }}
    //     renderMode="SVG"
    //     colorType="literal"
    //     width={WAFFLE_WIDTH}
    //     height={75}
    //     mode="dice"
    //     data={{
    //       color: 'rgba(255, 255, 255, 0)',
    //       children: data.map(d => ({...d})).sort((a, b) => b.count - a.count),
    //     }}
    //   />
    // );
  }
}
