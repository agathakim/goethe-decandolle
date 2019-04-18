import React from 'react';
import {Sunburst} from 'react-vis';

function updateData(data, hoveredComment) {
  if (!hoveredComment) {
    return data;
  }
  const categories = hoveredComment.categories.reduce((acc, row) => {
    acc[row] = true;
    return acc;
  }, {});
  // AGGG INCREDIBLY HACKY STYLE SETTING !!!??! AGHHHH 
  for (let i = 0; i < data.children.length; i++) {
    for (let j = 0; j < data.children[i].children.length; j++) {
      if (categories[data.children[i].children[j].cat]) {
        data.children[i].children[j].style = {
          strokeWidth: '5px',
          stroke: 'black',
          strokeOpacity: 1
        };
      }
    }
  }
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
        data={updateData(data, hoveredComment)}/>
    );
  }
}
