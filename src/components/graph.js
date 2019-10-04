import React from 'react';
import ReactDOM from 'react-dom';
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceCollide,
  forceLink,
} from 'd3-force';
import {select} from 'd3-selection';

import {WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';
const width = 960;
const height = 500;

// *****************************************************
// ** d3 functions to manipulate attributes
// *****************************************************

const enterNode = selection => {
  selection.attr('class', 'node');
  selection
    .append('circle')
    .attr('r', 8)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .on('mouseover', d => {
      console.log(d);
    });

  const marks = selection
    .selectAll('tag')
    .data(
      d => d.colors.map(color => ({color, sentenceIdx: d.sentenceIdx})),
      d => `${d.color}-${d.sentenceIdx}`,
    )
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('class', 'tag')
    .attr('fill', d => d.color)
    .attr('cx', (d, i, x) => {
      return Math.cos((Math.PI * 2 * i) / x.length) * 4;
    })
    .attr('cy', (d, i, x) => {
      return Math.sin((Math.PI * 2 * i) / x.length) * 4;
    });
  marks.exit().remove();

  // selection
  //   .append('text')
  //   .attr('x', d => d.size + 5)
  //   .attr('dy', '.35em')
  //   .text(d => d.key);
};

const updateNode = selection =>
  selection.attr('transform', d => `translate(${d.x},${d.y})`);

const enterLink = selection =>
  selection
    .attr('class', 'link')
    .attr('stroke', d => d.color)
    .attr('stroke-opacity', 0.2)
    .attr('stroke-width', 1);

const updateLink = selection => {
  selection
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y);
};

const updateGraph = selection => {
  selection.selectAll('.node').call(updateNode);
  selection.selectAll('.link').call(updateLink);
};

// *****************************************************
// ** Graph and App components
// *****************************************************
let count = 0;
export default class Graph extends React.Component {
  componentDidMount() {
    this.d3Graph = select(ReactDOM.findDOMNode(this.refs.graph));
    this.force = forceSimulation(this.props.nodes)
      .force(
        'link',
        forceLink()
          .distance(10)
          .links(this.props.links),
      )
      // .force('x', forceX().strength(0.002))
      // .force('y', forceY().strength(0.002))
      .force('center', forceCenter(WAFFLE_WIDTH / 2, WAFFLE_HEIGHT / 2))
      .force(
        'collide',
        forceCollide()
          .radius(d => 8)
          .iterations(2),
      )
      .force('charge', forceManyBody().strength(-50));
    this.force.on('tick', () => {
      if (count > 1000) {
        this.force.stop();
        console.log('halt');
        return;
      }
      // after force calculation starts, call updateGraph
      // which uses d3 to manipulate the attributes,
      // and React doesn't have to go through lifecycle on each tick
      this.d3Graph.call(updateGraph);
      count += 1;
      console.log(count);
    });

    this.updateGraph(this.props);
  }

  componentDidUpdate(nextProps) {
    this.updateGraph(nextProps);
  }

  componentWillUnmount() {
    this.force.stop();
  }

  updateGraph(nextProps) {
    this.d3Graph = select(ReactDOM.findDOMNode(this.refs.graph));
    console.log(nextProps.nodes);
    const d3Nodes = this.d3Graph
      .selectAll('.node')
      .data(nextProps.nodes, node => node.sentenceIdx);
    d3Nodes
      .enter()
      .append('g')
      .call(enterNode);
    d3Nodes.exit().remove();
    d3Nodes.call(updateNode);

    const d3Links = this.d3Graph
      .selectAll('.link')
      .data(nextProps.links, link => link.key);
    d3Links
      .enter()
      .insert('line', '.node')
      .call(enterLink);
    d3Links.exit().remove();
    d3Links.call(updateLink);

    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g ref="graph" />
      </svg>
    );
  }
}
