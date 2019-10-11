import React from 'react';
import {scaleLinear} from 'd3-scale';
export default class SteppedLegend extends React.Component {
  render() {
    const {
      steps = 5,
      colorMap,
      width,
      height,
      style = {},
      className = '',
      margin = {left: 0, right: 0, top: 0, bottom: 30},
      minVal = '',
      maxVal = '',
    } = this.props;
    const PLOT_WIDTH = width - margin.left - margin.right;
    const PLOT_HEIGHT = height - margin.top - margin.bottom;
    const xScale = scaleLinear()
      .domain([0, 1])
      .range([0, PLOT_WIDTH]);
    return (
      <svg width={width} height={height} className={`${className}`}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {[...new Array(steps)].map((_, idx) => (
            <rect
              key={`stepped-legend-step-${idx}`}
              x={xScale(idx / steps)}
              y="0"
              width={xScale(1 / steps)}
              height={PLOT_HEIGHT}
              fill={colorMap(idx / steps)}
              {...style}
            />
          ))}
          <text
            x={0}
            y={PLOT_HEIGHT + (margin.top + margin.bottom) / 2}
            fill="black"
          >
            {minVal}
          </text>
          <text
            textAnchor="end"
            x={PLOT_WIDTH}
            y={PLOT_HEIGHT + (margin.top + margin.bottom) / 2}
            fill="black"
          >
            {maxVal}
          </text>
        </g>
      </svg>
    );
  }
}
