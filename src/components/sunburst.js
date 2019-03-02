import React from 'react';

import {Sunburst} from 'react-vis';

export default class SunburstChart extends React.Component {
  render() {
    const {data} = this.props;
    console.log(data)
    return (
      <Sunburst
        hideRootNode
        opacity={0.75}
        colorType="literal"
        width={800}
        height={800}
        data={data}/>
    );
  }
}
