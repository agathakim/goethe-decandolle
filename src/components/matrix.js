import React from 'react';
import {scaleLinear} from 'd3-scale';
import {interpolateViridis} from 'd3-scale-chromatic';
import Switch from 'react-switch';

import {COLORS_FOR_LEGEND, WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

const pairToKey = pair => JSON.stringify(pair.sort());

function getRowMode(row) {
  return Object.entries(
    row.reduce((acc, pair) => {
      acc[pair[0]] = (acc[pair[0]] || 0) + 1;
      acc[pair[1]] = (acc[pair[1]] || 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1])[0][0];
}

const COLOR_PAIRS = COLORS_FOR_LEGEND.map(({color}) => {
  return COLORS_FOR_LEGEND.map(innerColor => {
    return [innerColor.color, color].sort();
  });
});

function getCounts(data) {
  const OPEN_COUNTS = COLOR_PAIRS.reduce(
    (acc, row) => acc.concat(row),
    [],
  ).reduce((acc, pair) => {
    const key = JSON.stringify(pair);
    acc[key] = 0;
    return acc;
  }, {});
  return data.reduce((acc, sent) => {
    const {colors} = sent;
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const key = JSON.stringify([colors[i], colors[j]].sort());
        acc[key] += 1;
      }
    }
    return acc;
  }, OPEN_COUNTS);
}

function prepBoxes(counts, hideEmptyRows) {
  const allowedColors = COLOR_PAIRS.reduce((mem, row) => {
    const rowSum = row.reduce((acc, pair) => counts[pairToKey(pair)] + acc, 0);
    mem[getRowMode(row)] = hideEmptyRows ? rowSum > 0 : true;
    return mem;
  }, {});
  const reducedColorPairs = hideEmptyRows
    ? COLOR_PAIRS.reduce((acc, row) => {
        if (!allowedColors[getRowMode(row)]) {
          return acc;
        }
        return acc.concat([
          row.filter(([a, b]) => allowedColors[a] && allowedColors[b]),
        ]);
      }, [])
    : COLOR_PAIRS;
  return {allowedColors, reducedColorPairs};
}

export default class RelativeCounts extends React.Component {
  constructor() {
    super();
    this.state = {hideEmptyRows: false};
  }
  render() {
    const {hideEmptyRows} = this.state;
    const {data} = this.props;
    const margin = {
      left: 60,
      top: 60,
      bottom: 0,
      right: 10,
    };

    const counts = getCounts(data);
    const {allowedColors, reducedColorPairs} = prepBoxes(counts, hideEmptyRows);

    const xScale = scaleLinear()
      .domain([0, reducedColorPairs.length])
      .range([0, WAFFLE_WIDTH - margin.left - margin.right]);
    const yScale = scaleLinear()
      .domain([0, reducedColorPairs.length])
      .range([0, WAFFLE_HEIGHT - margin.top - margin.bottom]);
    const colorMap = scaleLinear()
      .domain([
        0,
        Object.values(counts).reduce((acc, v) => Math.max(acc, v), 0),
      ])
      .range([0, 1]);
    const colorScale = v => interpolateViridis(Math.sqrt(colorMap(v)));

    return (
      <div>
        <svg width={WAFFLE_WIDTH} height={WAFFLE_HEIGHT}>
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {reducedColorPairs.reduce((acc, row, idx) => {
              const updatedRow = row.map((pair, jdx) => {
                const key = pairToKey(pair);
                return (
                  <rect
                    key={`${key}-${idx}-rect`}
                    fill={
                      pair[0] !== pair[1] ? colorScale(counts[key]) : 'white'
                    }
                    stroke="black"
                    width={xScale(1)}
                    height={yScale(1)}
                    x={xScale(jdx)}
                    y={yScale(idx)}
                  />
                );
              });

              return acc.concat(updatedRow);
            }, [])}
            {COLORS_FOR_LEGEND.filter(({color}) => allowedColors[color]).map(
              ({color, tag}, idx) => {
                return (
                  <g
                    transform={`translate(${xScale(idx + 0.5)}, ${yScale(0)})`}
                    key={`${color}-${tag}-matrix-x`}
                  >
                    <text
                      fontSize="12"
                      x="0"
                      y="0"
                      transform="rotate(-90)"
                      textAnchor="start"
                    >
                      {tag}
                    </text>
                  </g>
                );
              },
            )}
            {COLORS_FOR_LEGEND.filter(({color}) => allowedColors[color]).map(
              ({color, tag}, idx) => {
                return (
                  <g
                    transform={`translate(${xScale(-0.1)}, ${yScale(
                      idx + 0.6,
                    )})`}
                    key={`${color}-${tag}-matrix-y`}
                  >
                    <text fontSize="12" x="0" y="0" textAnchor="end">
                      {tag}
                    </text>
                  </g>
                );
              },
            )}
          </g>
        </svg>
        <div>
          <label htmlFor="hide-empty" className="switch-center">
            <span className="control-switch">Hide Empty Rows</span>
            <Switch
              checked={hideEmptyRows}
              onChange={() => this.setState({hideEmptyRows: !hideEmptyRows})}
              onColor="#86d3ff"
              onHandleColor="#2693e6"
              handleDiameter={20}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
              height={20}
              width={40}
              className="react-switch"
              id="hide-empty"
            />
          </label>
        </div>
      </div>
    );
  }
}
