import React from 'react';
import {COLORS_FOR_LEGEND} from '../constants';

export default class ColorLegend extends React.Component {
  render() {
    const {
      toggleConnections,
      validColors,
      toggleColor,
      recalculateGraphs,
      unselectAll,
      selectAll,
    } = this.props;
    return (
      <div className="flex-down legend">
        <h3> Legend + Controls</h3>

        {COLORS_FOR_LEGEND.map(({label, tag, color}) => {
          return (
            <div className="flex medium-font center" key={tag}>
              <div className="flex">
                <div
                  style={{
                    backgroundColor: color,
                    height: '20px',
                    width: '20px',
                    borderRadius: '100%',
                    marginRight: '3px',
                  }}
                />
              </div>
              <div className="flex-down">
                <div>
                  <b>{tag}</b>:<i>{label}</i>
                </div>
                <div className="flex">
                  <div className="medium-font">Showing</div>
                  <input
                    onChange={() => toggleColor(color)}
                    type="checkbox"
                    checked={validColors[color]}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={recalculateGraphs}> Recalculate Graphs</button>
        <button onClick={toggleConnections}> Toggle connections</button>
        <button onClick={selectAll}> Select All</button>
        <button onClick={unselectAll}> Select None</button>
      </div>
    );
  }
}
