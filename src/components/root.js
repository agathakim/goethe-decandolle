import React from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files} from '../constants';

export default class RootComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showConnections: true,
      calcIdx: 0,
      useInclusive: true,
      offscreenDrawingDisallowed: false,
    };
  }

  render() {
    const {
      showConnections,
      calcIdx,
      useInclusive,
      offscreenDrawingDisallowed,
    } = this.state;

    const columnVisProps = {
      showConnections,
      calcIdx,
      useInclusive,
      sendOffscreenNotAvailable: () =>
        this.setState({offscreenDrawingDisallowed: true}),
    };

    return (
      <div className="app-container">
        <div className="flex">
          <ColumnVisualizations
            defaultSelection={files[0].filePrefix}
            {...columnVisProps}
          />
          <div className="flex center full-height">
            <ColorLegend
              useInclusive={useInclusive}
              showConnections={showConnections}
              offscreenDrawingDisallowed={offscreenDrawingDisallowed}
              toggleInclusiveExclusive={() => {
                this.setState({useInclusive: !useInclusive});
              }}
              toggleConnections={() =>
                this.setState({showConnections: !showConnections})
              }
              recalculateGraphs={() => this.setState({calcIdx: calcIdx + 1})}
            />
          </div>
          {
            <ColumnVisualizations
              defaultSelection={files[3].filePrefix}
              {...columnVisProps}
            />
          }
        </div>
      </div>
    );
  }
}
