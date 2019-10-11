import React from 'react';
import Switch from 'react-switch';
import ReactTooltip from 'react-tooltip';
import Tooltip from './tooltip';
import {scaleLinear} from 'd3-scale';

import {
  WAFFLE_WIDTH,
  WAFFLE_HEIGHT,
  CHART_MARGIN,
  COLORS_FOR_LEGEND,
} from '../constants';
import {computeDomain, classnames, equalColorSets} from '../utils';

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
      selectedColor: null,
      progress: 0,
      links: [],
      nodes: [],
      hoveredComment: null,
      clickedComment: null,
      domain: {minX: 0, maxX: 0, minY: 0, maxY: 0},
      offscreenDrawingDisallowed: false,
      showConnections: true,
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
    const {nodes, links} = this.props;
    const htmlCanvas = this.refs.canvas;
    if (!htmlCanvas.transferControlToOffscreen) {
      this.setState({offscreenDrawingDisallowed: true});
      this.graphWorker.postMessage({nodes, links, noOffscreen: true});
    } else {
      const canvas = htmlCanvas.transferControlToOffscreen();

      this.graphWorker.postMessage({nodes, links, canvas}, [canvas]);
    }
  }

  componentWillUnmount() {
    this.graphWorker.terminate();
  }

  renderToggle() {
    const {offscreenDrawingDisallowed, showConnections} = this.state;
    return (
      <label htmlFor="toggle-connections" className="switch-center">
        <span
          className={classnames({
            'disabled-switch': offscreenDrawingDisallowed,
          })}
        >
          {!offscreenDrawingDisallowed && (
            <span className="control-switch"> Toggle connections</span>
          )}
          {offscreenDrawingDisallowed && (
            <span>
              <span
                data-tip
                data-for="disableSwitchTooltip"
                className="disable-switch-label control-switch"
              >
                {' '}
                Showing Connections is Disabled(?){' '}
              </span>
              <ReactTooltip
                id="disableSwitchTooltip"
                type="warning"
                effect="solid"
              >
                <span className="no-offscreen-message">
                  Rendeing the the connections between the nodes is an expensive
                  computational process, and, unfortunately, is currently only
                  available on Chrome. For a full experience please view this
                  page in an up to date copy of Chrome.
                </span>
              </ReactTooltip>
            </span>
          )}
        </span>
        <Switch
          checked={offscreenDrawingDisallowed ? false : showConnections}
          onChange={() => this.setState({showConnections: !showConnections})}
          disabled={offscreenDrawingDisallowed}
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
          id="toggle-connections"
        />
      </label>
    );
  }

  renderControls() {
    const {clickedComment, selectedColor} = this.state;
    const {barChartData} = this.props;

    return (
      <div>
        <h5>Controls</h5>
        <span className="small-font">
          Hover to view sentences,{' '}
          {clickedComment
            ? 'Click anywhere to unselect the highlighted tag type'
            : 'Click to Highlight a Particular Tag Set'}
        </span>
        <div className="flex">
          <button onClick={() => {}}> Recalculate Graphs</button>
          {this.renderToggle()}
        </div>
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

  render() {
    const {
      progress,
      nodes,
      hoveredComment,
      clickedComment,
      selectedColor,
      domain: {minX, maxX, minY, maxY},
      showConnections,
    } = this.state;
    const {getSentence, cooccuranceData} = this.props;

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
          Tooltip({hoveredComment, getSentence, cooccuranceData})}
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
        {this.renderControls()}
      </div>
    );
  }
}
