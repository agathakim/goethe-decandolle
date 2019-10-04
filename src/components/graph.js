import React from 'react';
import {scaleLinear} from 'd3-scale';

import {WAFFLE_WIDTH, WAFFLE_HEIGHT, CHART_MARGIN} from '../constants';
import {computeDomain} from '../utils';

function renderInnerCircles(node) {
  /* eslint-disable react/display-name */
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

    const htmlCanvas = this.refs.canvas;
    const offscreen = htmlCanvas.transferControlToOffscreen();

    this.graphWorker.postMessage(
      {
        nodes: this.props.nodes,
        links: this.props.links,
        canvas: offscreen,
      },
      [offscreen],
    );
  }

  render() {
    const {progress, nodes, hoveredComment} = this.state;
    const {getSentence, showConnections} = this.props;

    const {minX, maxX, minY, maxY} = computeDomain(nodes);

    const xScale = scaleLinear()
      .domain([minX, maxX])
      .range([0, WAFFLE_WIDTH - CHART_MARGIN.left - CHART_MARGIN.right]);
    const yScale = scaleLinear()
      .domain([minY, maxY])
      .range([0, WAFFLE_HEIGHT - CHART_MARGIN.top - CHART_MARGIN.bottom]);
    const progessScale = scaleLinear()
      .domain([0, 1])
      .range([0, WAFFLE_WIDTH]);

    return (
      <div style={{position: 'relative'}}>
        <svg width={WAFFLE_WIDTH} height={WAFFLE_HEIGHT} className="node-graph">
          <g transform={`translate(${CHART_MARGIN.left}, ${CHART_MARGIN.top})`}>
            {progress < 1 && (
              <rect
                x="0"
                y="0"
                height="2"
                width={progessScale(progress)}
                fill="steelblue"
              />
            )}
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
              zIndex: 2,
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
        <canvas
          width={WAFFLE_WIDTH}
          height={WAFFLE_HEIGHT}
          ref="canvas"
          className={showConnections ? 'link-graph' : 'link-graph hide'}
        />
        <span className="small-font">Hover to view sentences</span>
      </div>
    );
  }
}
