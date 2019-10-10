import React from 'react';
import {XYPlot, PolygonSeries} from 'react-vis';
import {TARGET_WIDTH, WAFFLE_WIDTH, WAFFLE_HEIGHT} from '../constants';

class StaticWaffle extends React.Component {
  render() {
    const {data, setHoveredComment} = this.props;
    return (
      <div className="static-waffle">
        <XYPlot
          height={WAFFLE_HEIGHT}
          width={WAFFLE_WIDTH}
          margin={0}
          onMouseOut={d => {
            setHoveredComment(null);
          }}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}
        >
          {
            // THE COLOR BLOCKS
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(
              row.map(({offset, colors}) => {
                return [...new Array(colors.length)].map((_, idx) => {
                  return (
                    <PolygonSeries
                      onSeriesMouseOver={d => {
                        setHoveredComment(idx);
                      }}
                      key={`${idx}-${jdx}-background`}
                      color={colors[idx]}
                      data={[
                        {x: offset + idx, y: jdx},
                        {x: offset + idx + 1, y: jdx},
                        {x: offset + idx + 1, y: jdx + 1},
                        {x: offset + idx, y: jdx + 1},
                      ]}
                    />
                  );
                });
              }),
            );
          }, [])}
          {
            // THE OUTLINES
          }
          {data.reduce((acc, row, jdx) => {
            return acc.concat(
              row.map(({offset, colors, sentenceIdx}, idx) => {
                return (
                  <PolygonSeries
                    onSeriesMouseOver={d => {
                      setHoveredComment(sentenceIdx);
                    }}
                    key={`groups-${idx}-${jdx}`}
                    style={{
                      fill: 'red',
                      fillOpacity: 0,
                      stroke: '#D6D6CE',
                      strokeWidth: '2.5px',
                    }}
                    data={[
                      {x: offset, y: jdx},
                      {x: offset + colors.length, y: jdx},
                      {x: offset + colors.length, y: jdx + 1},
                      {x: offset, y: jdx + 1},
                    ]}
                  />
                );
              }),
            );
          }, [])}
        </XYPlot>
      </div>
    );
  }
}

function getHoveredSquares(hoveredComment, data) {
  let hoveredSquares = [];
  if (!hoveredComment) {
    return hoveredSquares;
  }
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
          ],
        }));
      }
    }
  }
  return hoveredSquares;
}

class DynamicWaffle extends React.Component {
  render() {
    const {hoveredComment, data, toggleLock} = this.props;
    const hoveredSquares = getHoveredSquares(hoveredComment, data);
    return (
      <div className="dynamic-waffle">
        <XYPlot
          height={WAFFLE_HEIGHT}
          width={WAFFLE_WIDTH}
          margin={0}
          xDomain={[0, TARGET_WIDTH + 1]}
          yDomain={[data.length, 0]}
        >
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
          {hoveredSquares.length && (
            <PolygonSeries
              onSeriesClick={toggleLock}
              style={{
                stroke: 'black',
                strokeWidth: '4px',
                fill: 'red',
                fillOpacity: 0,
              }}
              data={[
                hoveredSquares[0].coords[0],
                hoveredSquares[hoveredSquares.length - 1].coords[1],
                hoveredSquares[hoveredSquares.length - 1].coords[2],
                hoveredSquares[0].coords[3],
              ]}
            />
          )}
        </XYPlot>
      </div>
    );
  }
}

export default class WaffleBook extends React.Component {
  constructor() {
    super();
    this.state = {
      hoveredComment: null,
    };
  }
  render() {
    const {data} = this.props;
    const {hoveredComment} = this.state;
    return (
      <div className="waffle-book">
        <StaticWaffle
          data={data}
          setHoveredComment={comment =>
            this.setState({hoveredComment: comment})
          }
        />
        <DynamicWaffle data={data} hoveredComment={hoveredComment} />
      </div>
    );
  }
}
