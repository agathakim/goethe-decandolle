import React from 'react';

import {Sunburst} from 'react-vis';
import {categoryRelationships} from '../constants';

const categoryRelationshipsMaps = categoryRelationships.reduce((acc, {superCat, cat}) => {
  acc[superCat] = cat;
  return acc;
}, {})

function updateData(data, hoveredComment) {
  if (!hoveredComment) {
    return data;
  }
  const categories = hoveredComment.categories;
  
  return data;
}

export default class SunburstChart extends React.Component {
  render() {
    const {data, hoveredComment} = this.props;
    return (
      <Sunburst
        hideRootNode
        opacity={0.75}
        colorType="literal"
        width={350}
        height={350}
        data={data}/>
    );
  }
}
