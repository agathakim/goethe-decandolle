import React from 'react';
import {XYPlot, PolygonSeries} from 'react-vis';
// import PolygonSeries from './polygon-series';
import {TARGET_WIDTH} from '../constants';
const WIDTH = 600;

const HEIGHT = 450;
class StaticWaffle extends React.Component {
  render() {
    const {data, setHoveredComment, lockedWaffle, toggleLock} = this.props;
    return (
      <div className="static-waffle"
        style={{
          opacity: lockedWaffle ? 0.1 : 1
        }}>
        <XYPlot 
          height={HEIGHT} 
          width={WIDTH} 
          margin={0}
          onMouseOut={d => {
            if (!lockedWaffle) {
              setHoveredComment(null);
            }
          }}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}>
          {
            // THE COLOR BLOCKS
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(row.map(({offset, colors}) => {
              return [...new Array(colors.length)].map((_, idx) => {
                return (<PolygonSeries 
                  onSeriesClick={toggleLock}
                  onSeriesMouseOver={d => {
                    if (!lockedWaffle) {
                      setHoveredComment(sentenceIdx);
                    }
                  }}
                  key={`${idx}-${jdx}-background`}
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
                onSeriesMouseOver={d => {
                  if (!lockedWaffle) {
                    setHoveredComment(sentenceIdx);
                  }
                }}
                onSeriesClick={toggleLock}
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
    const {hoveredComment, data, toggleLock} = this.props;
    let hoveredSquares = [];
    for (let jdx = 0; jdx < data.length; jdx++) {
      for (let idx = 0; idx < data[jdx].length; idx++) {
        const {sentenceIdx, offset, colors} = data[jdx][idx];
        if (sentenceIdx === hoveredComment.idx) {
          hoveredSquares = colors.map((color, kdx) => ({
            color,
            coords: [
              {x: offset + kdx, y: jdx},
              {x: offset + 1 + kdx, y: jdx},
              {x: offset + 1 + kdx, y: jdx + 1},
              {x: offset + kdx, y: jdx + 1},
            ]
          }));
        }
      }
    }

    return (
      <div className="dynamic-waffle">
        <XYPlot 
          height={HEIGHT} 
          width={WIDTH}
          margin={0}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}>
          {hoveredSquares.map(({color, coords}, idx) => {
              return (
                <PolygonSeries 
                  key={`sub-colors-${idx}`}
                  onSeriesClick={toggleLock}
                  style={{
                    fill: color,
                  }}
                  data={coords}
                  />
              );
          })}
          <PolygonSeries 
            onSeriesClick={toggleLock}
            style={{
              stroke: 'black',
              strokeWidth: '4px',
              fill: 'red',
              fillOpacity: 0
            }}
            data={[
              hoveredSquares[0].coords[0],
              hoveredSquares[hoveredSquares.length - 1].coords[1],
              hoveredSquares[hoveredSquares.length - 1].coords[2],
              hoveredSquares[0].coords[3],
            ]}/>
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
    return (
      <div className="waffle-book">
        <StaticWaffle 
          data={data} 
          toggleLock={toggleLock}
          lockedWaffle={lockedWaffle}
          setHoveredComment={setHoveredComment} />
        {hoveredComment && 
            <DynamicWaffle 
              toggleLock={toggleLock}
              data={data} 
              hoveredComment={hoveredComment} />}
        <div> click to lock </div>
      </div>
    );
  }
}
