import React from 'react';
import Sunburst from './sunburst';
import WaffleBook from './waffle-book';

import Picker from './file-picker';
import {files, DESCRIPTIONS} from '../constants';
import {getFile, prepSunburst, prepWaffleData} from '../utils';

export default class Column extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hoveredComment: null,
      selectedFile: files[0].filePrefix,
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
          this.setState({
            data: sentenceClassifcations,
            numberedSents,
            sunburstData: prepSunburst(sentenceClassifcations),
            waffleBookData: prepWaffleData(sentenceClassifcations),
            loading: false,
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
      waffleBookData,
      loading,
      selectedFile,
      lockedWaffle,
    } = this.state;
    if (loading) {
      return (
        <div className="flex-down">
          <h1>LOADING</h1>
        </div>
      );
    }

    return (
      <div className="flex-down">
        <Picker
          onSelect={newPrefix => this.updateData(newPrefix)}
          selectedFile={selectedFile}
        />
        <div className="flex-down">
          <h3>{DESCRIPTIONS[selectedFile].fullName}</h3>
          <p>{DESCRIPTIONS[selectedFile].description}</p>
        </div>
        <div className="flex-down">
          <div className="flex-down">
            <WaffleBook
              toggleLock={() => this.setState({lockedWaffle: !lockedWaffle})}
              lockedWaffle={lockedWaffle}
              hoveredComment={hoveredComment}
              setHoveredComment={this.setHoveredComment}
              data={waffleBookData}
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
