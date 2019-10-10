import React from 'react';
import Switch from 'react-switch';
import ReactTooltip from 'react-tooltip';
import {classnames} from '../utils';
import {COLORS_FOR_LEGEND} from '../constants';

export default class ColorLegend extends React.Component {
  render() {
    const {
      showConnections,
      toggleConnections,
      recalculateGraphs,
      toggleInclusiveExclusive,
      useInclusive,
      offscreenDrawingDisallowed,
    } = this.props;
    return (
      <div className="flex-down legend">
        <h3> Legend</h3>

        {COLORS_FOR_LEGEND.map(({label, tag, color}) => {
          return (
            <div className="flex medium-font center" key={tag}>
              <div className="flex">
                <div
                  className="legend-color"
                  style={{backgroundColor: color}}
                />
              </div>
              <div className="flex-down">
                <div>
                  <b>{tag}</b>:<i>{label}</i>
                </div>
              </div>
            </div>
          );
        })}
        <h3> Controls</h3>
        <button onClick={recalculateGraphs}> Recalculate Graphs</button>

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
                    Rendeing the the connections between the nodes is an
                    expensive computational process, and, unfortunately, is
                    currently only available on Chrome. For a full experience
                    please view this page in an up to date copy of Chrome.
                  </span>
                </ReactTooltip>
              </span>
            )}
          </span>
          <Switch
            checked={offscreenDrawingDisallowed ? false : showConnections}
            onChange={toggleConnections}
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

        <label htmlFor="inclusive-exclusive" className="switch-center">
          <span className="control-switch">Use inclusive</span>
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
