import React from 'react';
import Sunburst from './sunburst';
import WaffleBook from './waffle-book';
import Graph from './graph-2';

import Picker from './file-picker';
import {files, DESCRIPTIONS, WAFFLE_WIDTH} from '../constants';
import {getFile, prepSunburst, prepWaffleData} from '../utils';

export default class Column extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hoveredComment: null,
      selectedFile: props.defaultSelection || files[0].filePrefix,
      sunburstData: null,
      waffleBookData: null,
      loading: true,
      lockedWaffle: false,
    };
    this.setHoveredComment = this.setHoveredComment.bind(this);
    this.setAsyncState = this.setAsyncState.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  componentDidMount() {
    this.updateData(this.state.selectedFile);
  }

  setAsyncState(newState) {
    return new Promise(resolve => this.setState(newState, () => resolve()));
  }

  updateData(selectedFile) {
    // defaults to loading goethe
    this.setAsyncState({
      loading: true,
      selectedFile,
    }).then(() => {
      return getFile(selectedFile).then(
        ({sentenceClassifcations, numberedSents}) => {
          const waffleBookData = prepWaffleData(sentenceClassifcations);
          const graphNodes = waffleBookData.reduce(
            (acc, row) => acc.concat(row),
            [],
          );
          console.log(waffleBookData);
          const graphLinks = Object.values(
            Object.entries(
              graphNodes.reduce((acc, row) => {
                row.colors.forEach(color => {
                  acc[color] = (acc[color] || []).concat(row.sentenceIdx);
                });
                return acc;
              }, {}),
            )
              .reduce((acc, [color, colorGroup]) => {
                for (let i = 0; i < colorGroup.length; i++) {
                  for (let j = i; j < colorGroup.length; j++) {
                    acc.push({
                      source: colorGroup[i],
                      target: colorGroup[j],
                      color,
                    });
                  }
                }
                return acc;
              }, [])
              .reduce((acc, {source, target, color}) => {
                acc[`${source}-${target}-${color}`] = {source, target, color};
                return acc;
              }, {}),
          );
          this.setState({
            data: sentenceClassifcations,
            numberedSents,
            sunburstData: prepSunburst(sentenceClassifcations),
            waffleBookData,
            loading: false,
            graphNodes,
            graphLinks,
          });
        },
      );
    });
  }

  setHoveredComment(payload) {
    if (!isFinite(payload) || (!payload && payload !== 0)) {
      this.setState({hoveredComment: null});
      return;
    }

    const row = this.state.data[payload];
    const cats = Object.keys(
      Object.entries(row).reduce((acc, [key, val]) => {
        if (!val || key === 'index') {
          return acc;
        }
        acc[key] = true;
        return acc;
      }, {}),
    );
    this.setState({
      hoveredComment: {
        sentence: this.state.numberedSents[payload],
        idx: payload,
        categories: cats,
      },
    });
  }
  render() {
    const {
      hoveredComment,
      sunburstData,
      loading,
      selectedFile,
      graphNodes,
      graphLinks,
    } = this.state;
    if (loading) {
      return (
        <div
          style={{
            width: `${WAFFLE_WIDTH}px`,
          }}
          className="flex-down center full-height"
        >
          <h1>LOADING</h1>
        </div>
      );
    }

    return (
      <div
        style={{
          width: `${WAFFLE_WIDTH}px`,
        }}
        className="flex-down"
      >
        <Picker
          onSelect={newPrefix => this.updateData(newPrefix)}
          selectedFile={selectedFile}
        />
        <div className="flex-down descriptions">
          <h3>{DESCRIPTIONS[selectedFile].fullName}</h3>
          <p>{DESCRIPTIONS[selectedFile].description}</p>
        </div>
        <div className="flex-down">
          <div className="flex-down">
            {
              // <WaffleBook
              // toggleLock={() => this.setState({lockedWaffle: !lockedWaffle})}
              // lockedWaffle={lockedWaffle}
              // hoveredComment={hoveredComment}
              // setHoveredComment={this.setHoveredComment}
              // data={waffleBookData}
              // />
            }
          </div>
          <div>
            <Graph
              nodes={graphNodes}
              links={graphLinks}
              prefix={selectedFile}
            />
          </div>
          <div className="flex-down">
            {<Sunburst hoveredComment={hoveredComment} data={sunburstData} />}
            <div className="sentence-box">
              <div>
                {hoveredComment
                  ? hoveredComment.sentence
                  : 'hover over grid to the right to select a sentence'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
