import React from 'react';
import Switch from 'react-switch';

import {COLORS_FOR_LEGEND} from '../constants';

export default class ColorLegend extends React.Component {
  render() {
    const {
      showConnections,
      toggleConnections,
      validColors,
      toggleColor,
      recalculateGraphs,
      unselectAll,
      selectAll,
      toggleInclusiveExclusive,
      useInclusive,
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
                  <label className="container">
                    <input
                      onChange={() => toggleColor(color)}
                      type="checkbox"
                      checked={validColors[color]}
                    />
                    <span className="checkmark">Showing</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={recalculateGraphs}> Recalculate Graphs</button>
        <div className="flex">
          <button onClick={selectAll}> Select All</button>
          <button onClick={unselectAll}> Unselect All</button>
        </div>

        <label htmlFor="toggle-connections" className="switch-center">
          <span>Toggle connections</span>
          <Switch
            checked={showConnections}
            onChange={toggleConnections}
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

        <label htmlFor="inclusive-exclusive" className="switch-center">
          <span>Use inclusive</span>
          <Switch
            checked={useInclusive}
            onChange={toggleInclusiveExclusive}
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
            id="inclusive-exclusive"
          />
        </label>
      </div>
    );
  }
}
