import React from 'react';
import {scaleLinear} from 'd3-scale';

import {WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

export default class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      links: [],
      nodes: [],
    };
  }
  componentDidMount() {
    this.graphWorker = new Worker('./graph-worker.js', {type: 'module'});
    this.graphWorker.onmessage = event => {
      switch (event.data.type) {
        default:
        case 'tick':
          this.setState({progress: event.data.progress});
          return;
        case 'end':
          this.setState({
            progress: 1,
            links: event.data.links,
            nodes: event.data.nodes,
          });
          return;
      }
    };
    this.graphWorker.postMessage({
      nodes: this.props.nodes,
      links: this.props.links,
    });
  }

  render() {
    const {progress, links, nodes} = this.state;
    const margin = {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
    };
    const {minX, maxX, minY, maxY} = nodes.reduce(
      (acc, {x, y}) => {
        return {
          minX: Math.min(acc.minX, x),
          maxX: Math.max(acc.maxX, x),
          minY: Math.min(acc.minY, y),
          maxY: Math.max(acc.maxY, y),
        };
      },
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
      },
    );
    const xScale = scaleLinear()
      .domain([minX, maxX])
      .range([0, WAFFLE_WIDTH - margin.left - margin.right]);
    const yScale = scaleLinear()
      .domain([minY, maxY])
      .range([0, WAFFLE_HEIGHT - margin.top - margin.bottom]);
    const progessScale = scaleLinear()
      .domain([0, 1])
      .range([0, WAFFLE_WIDTH]);

    return (
      <svg width={WAFFLE_WIDTH} height={WAFFLE_HEIGHT}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {progress < 1 && (
            <rect
              x="0"
              y="0"
              height="2"
              width={progessScale(progress)}
              fill="steelblue"
            />
          )}
          {links.map(d => {
            return (
              <line
                key={`${d.source.sentenceIdx}-${d.target.sentenceIdx}-${d.color}`}
                x1={xScale(d.source.x)}
                x2={xScale(d.target.x)}
                y1={yScale(d.source.y)}
                y2={yScale(d.target.y)}
                strokeOpacity="0.3"
                stroke={d.color}
              />
            );
          })}
          {nodes.map(node => {
            return (
              <g
                key={`node-${node.sentenceIdx}`}
                transform={`translate(${xScale(node.x)}, ${yScale(node.y)})`}
              >
                {node.colors.map((color, idx) => {
                  return (
                    <circle
                      key={`node-${node.sentenceIdx}-${color}-${idx}`}
                      fill={color}
                      cx={
                        Math.cos((Math.PI * 2 * idx) / node.colors.length) * 4
                      }
                      cy={
                        Math.sin((Math.PI * 2 * idx) / node.colors.length) * 4
                      }
                      r="4"
                    />
                  );
                })}
              </g>
            );
          })}
          {nodes.map(node => {
            return (
              <circle
                key={`node-${node.sentenceIdx}`}
                fill="none"
                stroke="black"
                cx={xScale(node.x)}
                cy={yScale(node.y)}
                r="10"
              />
            );
          })}
        </g>
      </svg>
    );
  }
}
