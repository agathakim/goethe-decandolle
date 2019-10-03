import React from 'react';
import {Treemap} from 'react-vis';
import {WAFFLE_WIDTH} from '../constants';

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
          strokeOpacity: 1,
        };
      }
    }
  }
  return data;
}

export default class Radial extends React.Component {
  render() {
    const {data, hoveredComment} = this.props;
    return (
      <Treemap
        opacity={1}
        colorType="literal"
        width={WAFFLE_WIDTH}
        height={350}
        getLabel={d => d.cat}
        data={updateData(data, hoveredComment)}
      />
    );
  }
}
