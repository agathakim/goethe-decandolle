import React from 'react';
import {scaleLinear} from 'd3-scale';

import {WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

function computeDomain(nodes) {
  return nodes.reduce(
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
}

function prepareRenderLink(xScale, yScale) {
  /* eslint-disable react/display-name */
  return d => (
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
}

function renderInnerCircles(node) {
  const radius = node.colors.length > 1 ? 4 : 0;
  return (color, idx) => {
    const angle = (Math.PI * 2 * idx) / node.colors.length;
    return (
      <circle
        key={`node-${node.sentenceIdx}-${color}-${idx}`}
        fill={color}
        cx={Math.cos(angle) * radius}
        cy={Math.sin(angle) * radius}
        r="4"
      />
    );
  };
}

export default class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      links: [],
      nodes: [],
      hoveredComment: null,
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
    const {progress, links, nodes, hoveredComment} = this.state;
    const {getSentence, showConnections} = this.props;
    const margin = {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
    };
    const {minX, maxX, minY, maxY} = computeDomain(nodes);

    const xScale = scaleLinear()
      .domain([minX, maxX])
      .range([0, WAFFLE_WIDTH - margin.left - margin.right]);
    const yScale = scaleLinear()
      .domain([minY, maxY])
      .range([0, WAFFLE_HEIGHT - margin.top - margin.bottom]);
    const progessScale = scaleLinear()
      .domain([0, 1])
      .range([0, WAFFLE_WIDTH]);

    const smallerLinks = links.filter(d => {
      return (
        Math.sqrt(
          Math.pow(d.source.x - d.target.x, 2) +
            Math.pow(d.source.y - d.target.y, 2),
        ) > 10
      );
    });
    console.log(smallerLinks.length, links);
    return (
      <div style={{position: 'relative'}}>
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
            {showConnections &&
              smallerLinks.map(prepareRenderLink(xScale, yScale))}
            {nodes.map(node => {
              return (
                <g
                  key={`node-${node.sentenceIdx}`}
                  transform={`translate(${xScale(node.x)}, ${yScale(node.y)})`}
                >
                  {node.colors.map(renderInnerCircles(node))}
                </g>
              );
            })}
            {nodes.map(node => {
              return (
                <circle
                  onMouseEnter={e => {
                    this.setState({
                      hoveredComment: {
                        node,
                        offsetX: xScale(node.x),
                        offsetY: yScale(node.y),
                      },
                    });
                  }}
                  onMouseLeave={() => this.setState({hoveredComment: null})}
                  key={`node-${node.sentenceIdx}`}
                  fill="red"
                  fillOpacity="0"
                  stroke="black"
                  cx={xScale(node.x)}
                  cy={yScale(node.y)}
                  r="10"
                />
              );
            })}
          </g>
        </svg>
        {hoveredComment && (
          <div
            className="tooltip"
            style={{
              top: hoveredComment.offsetY + 50,
              left: hoveredComment.offsetX + 10,
            }}
          >
            <div className="flex">
              {hoveredComment.node.colors.map(color => {
                return (
                  <div
                    key={`hover-${color}`}
                    style={{
                      height: '10px',
                      width: '10px',
                      backgroundColor: color,
                    }}
                  />
                );
              })}
            </div>
            {getSentence(hoveredComment.node.sentenceIdx)}
          </div>
        )}
        <span className="small-font">Hover to view sentences</span>
      </div>
    );
  }
}
