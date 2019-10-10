import React from 'react';
import {scaleLinear} from 'd3-scale';

import {
  WAFFLE_WIDTH,
  WAFFLE_HEIGHT,
  CHART_MARGIN,
  COLORS_FOR_LEGEND,
} from '../constants';
import {computeDomain, classnames} from '../utils';

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

function equalColorSets(arrA, arrB) {
  if (arrA.length !== arrB.length) {
    return false;
  }
  for (let idx = 0; idx < arrA.length; idx++) {
    if (arrA[idx] !== arrB[idx]) {
      return false;
    }
  }
  return true;
}

function renderTooltip(hoveredComment, getSentence, cooccuranceData) {
  const count = cooccuranceData[JSON.stringify(hoveredComment.node.colors)];
  const similarMessage =
    count === 1
      ? '(Unique tag set)'
      : `(${count} sentencess have this tag set)`;
  return (
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
              className="color-block"
              key={`hover-${color}`}
              style={{backgroundColor: color}}
            />
          );
        })}
        <span className="small-font">{similarMessage}</span>
      </div>
      {getSentence(hoveredComment.node.sentenceIdx)}
    </div>
  );
}

export default class Graph extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedColor: null,
      progress: 0,
      links: [],
      nodes: [],
      hoveredComment: null,
      clickedComment: null,
      domain: {minX: 0, maxX: 0, minY: 0, maxY: 0},
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
            nodes: event.data.nodes,
            domain: computeDomain(event.data.nodes),
          });
          return;
      }
    };
    const {nodes, links, sendOffscreenNotAvailable} = this.props;
    const htmlCanvas = this.refs.canvas;
    const offscreenNotAvailable = !htmlCanvas.transferControlToOffscreen;
    if (offscreenNotAvailable) {
      sendOffscreenNotAvailable();
      this.graphWorker.postMessage({nodes, links, noOffscreen: true});
    } else {
      const canvas = htmlCanvas.transferControlToOffscreen();

      this.graphWorker.postMessage({nodes, links, canvas}, [canvas]);
    }
  }

  render() {
    const {
      progress,
      nodes,
      hoveredComment,
      clickedComment,
      selectedColor,
      domain: {minX, maxX, minY, maxY},
    } = this.state;
    const {
      getSentence,
      showConnections,
      cooccuranceData,
      barChartData,
    } = this.props;

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
        {this.props.nodes.length === 0 && (
          <div>
            <h5>
              There are no sentences tagged with just this combination of nodes,
              please add more categories
            </h5>
          </div>
        )}
        <svg
          onMouseLeave={() =>
            this.setState({clickedComment: false, selectedColor: null})
          }
          width={WAFFLE_WIDTH}
          height={WAFFLE_HEIGHT}
          className="node-graph"
        >
          {(clickedComment || selectedColor) && (
            <rect
              width={WAFFLE_WIDTH}
              height={WAFFLE_HEIGHT}
              fill="red"
              opacity="0"
              onClick={() => {
                this.setState({clickedComment: null});
              }}
            />
          )}
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
                  className={classnames({
                    displayNode: true,
                    opaqueDisplayNode:
                      (clickedComment &&
                        !equalColorSets(node.colors, clickedComment.colors)) ||
                      (selectedColor &&
                        node.colors.every(color => color !== selectedColor)),
                  })}
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
                  className={classnames({
                    displayNode: true,
                  })}
                  onMouseEnter={e => {
                    this.setState({
                      hoveredComment: {
                        node,
                        offsetX: xScale(node.x),
                        offsetY: yScale(node.y),
                      },
                    });
                  }}
                  onClick={e => {
                    this.setState({clickedComment: node});
                  }}
                  onMouseLeave={() => this.setState({hoveredComment: null})}
                  key={`node-${node.sentenceIdx}`}
                  fill="red"
                  fillOpacity="0"
                  stroke="black"
                  strokeOpacity="0.3"
                  cx={xScale(node.x)}
                  cy={yScale(node.y)}
                  r="10"
                />
              );
            })}
          </g>
        </svg>
        {hoveredComment &&
          renderTooltip(hoveredComment, getSentence, cooccuranceData)}
        <canvas
          width={WAFFLE_WIDTH}
          height={WAFFLE_HEIGHT}
          ref="canvas"
          className={classnames({
            'link-graph': true,
            hide: !showConnections,
            mute: clickedComment || selectedColor,
          })}
        />
        <span className="small-font">
          Hover to view sentences,{' '}
          {clickedComment
            ? 'Click anywhere to unselect the highlighted tag type'
            : 'Click to Highlight a Particular Tag Set'}
        </span>
        <h5>Select single color classes</h5>
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
}
