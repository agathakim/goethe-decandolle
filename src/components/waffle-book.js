import React from 'react';
import {XYPlot, PolygonSeries} from 'react-vis';

export default class WaffleBook extends React.Component {
  render() {
    const exampleGroups = [
      [
        {colors: ['#01B050', '#66FFCC', '#00CC99', '#006600', '#00FF02'], offset: 0}
      ],
      [
        {colors: ['#FF3301', '#66FFCC'], offset: 0},
        {colors: ['#FFC001', '#CC3399'], offset: 2}
      ]
    ];
    const {data} = this.props;
    return (
      <div>
        <XYPlot height={1000} width={2500}>
          {
            // THE COLOR BLOCKS
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(row.map(({offset, colors}) => {
              return [...new Array(colors.length)].map((_, idx) => {
                return (<PolygonSeries 
                  key={`${idx}-${jdx}`}
                  color={colors[idx]}
                  style={{
                    fillOpacity: 0.75,
                    strokeOpacity: 0.75
                  }}
                  data={[
                    {x: offset + idx, y: jdx},
                    {x: offset + idx + 1, y: jdx},
                    {x: offset + idx + 1, y: jdx + 1},
                    {x: offset + idx, y: jdx + 1},
                  ]}
                  />);
              });
            }));
          }, [])}
          {
            // THE OUTLINES
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(row.map(({offset, colors}, idx) => {
              return (<PolygonSeries 
                key={`groups-${idx}-${jdx}`}
                style={{
                  fill: 'red',
                  fillOpacity: 0,
                  stroke: 'black',
                  strokeWidth: '10px'
                }}
                data={[
                  {x: offset, y: jdx},
                  {x: offset + colors.length, y: jdx},
                  {x: offset + colors.length, y: jdx + 1},
                  {x: offset, y: jdx + 1},
                ]}
                />)
            }))
          }, [])}
        </XYPlot>
      </div>
    );
  }
}
