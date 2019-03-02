import React from 'react';
import {AbstractSeries} from 'react-vis';

const predefinedClassName = 'rv-xy-plot__series rv-xy-plot__series--polygon';
const DEFAULT_COLOR = '#12939A';

const generatePath = (data, xFunctor, yFunctor) =>
  `${data.reduce(
    (res, row, i) => `${res} ${i ? 'L' : 'M'}${xFunctor(row)} ${yFunctor(row)}`,
    ''
  )} Z`;

class PolygonSeries extends AbstractSeries {
  render() {
    const {
      color,
      className,
      data,
      marginLeft,
      marginTop,
      style,
      onSeriesClick = () => {}
    } = this.props;

    if (!data) {
      return null;
    }

    const xFunctor = this._getAttributeFunctor('x');
    const yFunctor = this._getAttributeFunctor('y');

    return (
      <path
        {...{
          className: `${predefinedClassName} ${className}`,
          onMouseOver: e => this._seriesMouseOverHandler(data, e),
          onMouseOut: e => this._seriesMouseOutHandler(data, e),
          onClick: e => {
            console.log(onSeriesClick)
            onSeriesClick(e);
          },
          onContextMenu: this._seriesRightClickHandler,
          fill: color || DEFAULT_COLOR,
          style,
          d: generatePath(data, xFunctor, yFunctor),
          transform: `translate(${marginLeft},${marginTop})`
        }}
      />
    );
  }
}

PolygonSeries.displayName = 'PolygonSeries';

export default PolygonSeries;
