import React from 'react';

import {Sankey} from 'react-vis';

const MODE = ['justify', 'center', 'left', 'right'];

export default class EnergySankey extends React.Component {
  constructor() {
    super();
    this.state = {
      modeIndex: 2
    };
  }

  updateModeIndex(increment) {
    const newIndex = this.state.modeIndex + (increment ? 1 : -1);
    const modeIndex =
      newIndex < 0 ? MODE.length - 1 : newIndex >= MODE.length ? 0 : newIndex;
    this.setState({modeIndex});
  }

  render() {
    const {modeIndex} = this.state;
    const {data = {nodes: [], links: []}} = this.props;
    const {links, nodes} = data;

    return (
      <div className="centered-and-flexed">
        <div className="centered-and-flexed-controls">
        {

          // <ShowcaseButton
          // onClick={() => this.updateModeIndex(false)}
          // buttonContent={'PREV MODE'}
          // />
          // <div> {MODE[modeIndex]} </div>
          // <ShowcaseButton
          // onClick={() => this.updateModeIndex(true)}
          // buttonContent={'NEXT MODE'}
          // />
        }
        </div>
        <Sankey
          animation
          margin={50}
          nodes={nodes}
          links={links}
          width={960}
          align={MODE[modeIndex]}
          height={1200}

          colorType="literal"
          style={{
            links: {
              opacity: 0.3
            },
            labels: {
              fontSize: '8px'
            },
            rects: {
              strokeWidth: 2,
              stroke: '#1A3177'
            }
          }}
        />
      </div>
    );
  }
}
