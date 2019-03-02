import React from 'react';
import {XYPlot} from 'react-vis';
import PolygonSeries from './polygon-series';
import {TARGET_WIDTH} from '../constants';
const WIDTH = 750;

const HEIGHT = 500;
class StaticWaffle extends React.Component {
  render() {
    const {data, setHoveredComment, toggleLock} = this.props;
    return (
      <div className="static-waffle">
        <XYPlot 
          height={HEIGHT} 
          width={WIDTH} 
          onMouseOut={d => setHoveredComment(null)}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}>
          {
            // THE COLOR BLOCKS
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(row.map(({offset, colors}) => {
              return [...new Array(colors.length)].map((_, idx) => {
                return (<PolygonSeries 
                  onSeriesClick={d => {
                    console.log(d)
                    this.props.toggleLock()
                  }}
                  onSeriesMouseOver={d => setHoveredComment(sentenceIdx)}
                  key={`${idx}-${jdx}`}
                  color={colors[idx]}
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
            return acc.concat(row.map(({offset, colors, sentenceIdx}, idx) => {
              return (<PolygonSeries 
                onSeriesClick={d => {
                  console.log(d)
                  this.props.toggleLock()
                }}
                onSeriesMouseOver={d => setHoveredComment(sentenceIdx)}
                key={`groups-${idx}-${jdx}`}
                style={{
                  fill: 'red',
                  fillOpacity: 0,
                  stroke: '#fff',
                  strokeWidth: '2.5px'
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
    )
  }
}


class DynamicWaffle extends React.Component {
  render() {
    const {hoveredComment, data} = this.props;
    let hoveredSquare = null;
    for (let jdx = 0; jdx < data.length; jdx++) {
      for (let idx = 0; idx < data[jdx].length; idx++) {
        const {sentenceIdx, offset, colors} = data[jdx][idx];
        if (sentenceIdx === hoveredComment.idx) {
          hoveredSquare = [
            {x: offset, y: jdx},
            {x: offset + colors.length, y: jdx},
            {x: offset + colors.length, y: jdx + 1},
            {x: offset, y: jdx + 1},
          ];
        }
      }
    }

    return (
      <div className="dynamic-waffle">
        <XYPlot 
          height={HEIGHT} 
          width={WIDTH}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}>
          <PolygonSeries 
            style={{
              fill: 'red',
              fillOpacity: 0,
              stroke: 'black',
              strokeWidth: '2.5px'
            }}
            data={hoveredSquare}
            />
        </XYPlot>
      </div>
    )
  }
}


export default class WaffleBook extends React.Component {
  render() {
    const {
      data,
      lockedWaffle,
      setHoveredComment, 
      hoveredComment, 
      toggleLock
    } = this.props;
    console.log(lockedWaffle)
    return (
      <div className="waffle-book">
        <StaticWaffle 
          data={data} 
          toggleLock={toggleLock}
          setHoveredComment={setHoveredComment} />
        {hoveredComment && 
            <DynamicWaffle 
              data={data} 
              hoveredComment={hoveredComment} />}
      </div>
    );
  }
}
