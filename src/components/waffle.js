import React from 'react';
import {scaleLinear} from 'd3-scale';

import Tooltip from './tooltip';
import {TARGET_WIDTH, WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

export default class WaffleBook extends React.Component {
  constructor() {
    super();
    this.state = {
      hoveredComment: null,
      selectedColor: null,
    };
  }

  renderControls() {
    const {selectedColor} = this.state;
    const {barChartData} = this.props;

    return (
      <div>
        <h5>Controls</h5>
        <div
          className="flex"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {barChartData.map(({color, tag, count}) => {
            return (
              <button
                key={`${color}-${tag}-select`}
                onClick={() => {
                  this.setState({selectedColor: color});
                }}
                className="flex"
                style={{cursor: 'pointer', marginRight: '8px'}}
              >
                <span
                  style={{
                    height: '10px',
                    width: '10px',
                    backgroundColor: color,
                  }}
                />
                <span className="small-font">
                  {tag}: {count}
                </span>
              </button>
            );
          })}
          {selectedColor && (
            <button onClick={() => this.setState({selectedColor: null})}>
              DESELECT
            </button>
          )}
        </div>
      </div>
    );
  }

  render() {
    const margin = {left: 0, top: 0, right: 0, bottom: 10};
    const {data, getSentence, cooccuranceData} = this.props;
    const {hoveredComment, selectedColor} = this.state;
    const xScale = scaleLinear()
      .domain([0, TARGET_WIDTH + 1])
      .range([0, WAFFLE_WIDTH - margin.left - margin.right]);
    const yScale = scaleLinear()
      .domain([0, data.length + 1])
      .range([0, WAFFLE_HEIGHT - margin.top - margin.bottom]);

    return (
      <div className="waffle-book" style={{position: 'relative'}}>
        <svg
          height={WAFFLE_HEIGHT}
          width={WAFFLE_WIDTH}
          onMouseLeave={() =>
            this.setState({hoveredComment: null, selectedColor: null})
          }
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {data.reduce((acc, row, ydx) => {
              const sents = row.reduce((mem, sentence) => {
                const sentenceIncludesSelected =
                  selectedColor && sentence.colors.includes(selectedColor);
                const rects = sentence.colors.map((color, idx) => {
                  return (
                    <rect
                      key={`color-rect-${idx}-${ydx}-${sentence.offset}`}
                      height={yScale(1)}
                      width={xScale(1)}
                      x={xScale(sentence.offset + idx)}
                      y={yScale(ydx)}
                      opacity={
                        selectedColor ? (sentenceIncludesSelected ? 1 : 0.1) : 1
                      }
                      fill={color}
                    />
                  );
                });
                return mem.concat(rects);
              }, []);
              return acc.concat(sents);
            }, [])}

            {data.reduce((acc, row, ydx) => {
              const sents = row.map(sentence => {
                return (
                  <rect
                    key={`color-sent-${ydx}-${sentence.offset}`}
                    className="sentence-rect"
                    height={yScale(1)}
                    width={xScale(sentence.colors.length)}
                    x={xScale(sentence.offset)}
                    y={yScale(ydx)}
                    fill="red"
                    fillOpacity="0"
                    stroke="#D6D6CE"
                    strokeWidth="3"
                    onMouseEnter={e =>
                      this.setState({
                        hoveredComment: {
                          node: sentence,
                          offsetX: xScale(sentence.offset),
                          offsetY: yScale(ydx),
                        },
                      })
                    }
                  />
                );
              });
              return acc.concat(sents);
            }, [])}

            {hoveredComment && (
              <rect
                className="hover-box"
                fillOpacity="0.1"
                strokeOpacity="1"
                stroke="black"
                strokeWidth="5"
                fill="black"
                x={hoveredComment.offsetX}
                y={hoveredComment.offsetY}
                width={xScale(hoveredComment.node.colors.length)}
                height={yScale(1)}
              />
            )}
          </g>
        </svg>
        {hoveredComment &&
          Tooltip({hoveredComment, getSentence, cooccuranceData})}
        {this.renderControls()}
      </div>
    );
  }
}
