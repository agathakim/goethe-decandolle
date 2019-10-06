import React from 'react';
import ColumnVisualizations from './column';
import ColorLegend from './color-legend';
import {files, COLORS_FOR_LEGEND} from '../constants';

export default class RootComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showConnections: true,
      validColors: COLORS_FOR_LEGEND.reduce((acc, {color}) => {
        acc[color] = true;
        return acc;
      }, {}),
      calcIdx: 0,
    };
  }

  render() {
    const {showConnections, validColors, calcIdx} = this.state;
    const changeAllSelection = setTo => () => {
      const newColors = Object.keys(validColors).reduce((acc, row) => {
        acc[row] = setTo;
        return acc;
      }, {});
      this.setState({validColors: newColors});
    };
    const columnVisProps = {
      showConnections,
      calcIdx,
      validColors,
    };
    return (
      <div>
        <div className="flex">
          <ColumnVisualizations
            defaultSelection={files[3].filePrefix}
            {...columnVisProps}
          />
          <div className="flex center full-height">
            <ColorLegend
              validColors={validColors}
              toggleColor={color => {
                const newColors = {...validColors};
                newColors[color] = !newColors[color];
                this.setState({validColors: newColors});
              }}
              toggleConnections={() => {
                this.setState({showConnections: !showConnections});
              }}
              recalculateGraphs={() => {
                this.setState({calcIdx: calcIdx + 1});
              }}
              unselectAll={changeAllSelection(false)}
              selectAll={changeAllSelection(true)}
            />
          </div>
          {
            // <ColumnVisualizations
            //   defaultSelection={files[0].filePrefix}
            //   {...columnVisProps}
            // />
          }
        </div>
      </div>
    );
  }
}
