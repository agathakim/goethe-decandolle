import React from 'react';
import {select} from 'd3-selection';
import {VennDiagram} from 'venn.js';

export default class Venn extends React.Component {
  componentDidMount() {
    this.renderVenn(this.props);
  }

  renderVenn(props) {
    const {data} = this.props;
    console.log(data)
    var dataSets = [
      {sets: ['A'], size: 12},
      {sets: ['B'], size: 12},
      {sets: ['C'], size: 2},
      {sets: ['A', 'B', 'C'], size: 2}
    ]
    const chart = VennDiagram();
    select('#venn').datum(dataSets).call(chart);

    // redraw the diagram on any change in input
    // d3.selectAll("input").on("change", function() {
    //     d3.select("#venn").datum(getSetIntersections()).call(chart);
    // });
  }

  render() {
    return (
      <div className="centered-and-flexed">
        <div id="venn"/>
      </div>
    );
  }
}
