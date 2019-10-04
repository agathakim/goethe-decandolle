import React from 'react';
import BarChart from './barchart';
import Graph from './graph';
import Picker from './file-picker';

import {files, DESCRIPTIONS, WAFFLE_WIDTH} from '../constants';
import {getFile, prepBarChart, prepWaffleData} from '../utils';

function generateGraphLinks(graphNodes) {
  const colorGroups = Object.entries(
    graphNodes.reduce((acc, row) => {
      row.colors.forEach(color => {
        acc[color] = (acc[color] || []).concat(row.sentenceIdx);
      });
      return acc;
    }, {}),
  );

  const dedupledLinks = colorGroups
    .reduce((acc, [color, colorGroup]) => {
      for (let i = 0; i < colorGroup.length; i++) {
        for (let j = i; j < colorGroup.length; j++) {
          if (i !== j) {
            acc.push({
              source: colorGroup[i],
              target: colorGroup[j],
              color,
            });
          }
        }
      }
      return acc;
    }, [])
    .reduce((acc, {source, target, color}) => {
      acc[`${source}-${target}-${color}`] = {source, target, color};
      return acc;
    }, {});

  return Object.values(dedupledLinks);
}

export default class Column extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hoveredComment: null,
      selectedFile: props.defaultSelection || files[0].filePrefix,
      barChartData: null,
      waffleBookData: null,
      loading: true,
      lockedWaffle: false,
    };
    this.setHoveredComment = this.setHoveredComment.bind(this);
    this.setAsyncState = this.setAsyncState.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  componentDidMount() {
    this.updateData(this.state.selectedFile, this.props.validColors);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.calcIdx !== this.props.calcIdx) {
      this.updateData(this.state.selectedFile, this.props.validColors);
    }
  }

  setAsyncState(newState) {
    return new Promise(resolve => this.setState(newState, () => resolve()));
  }

  updateData(selectedFile, validColors) {
    // defaults to loading goethe
    this.setAsyncState({
      loading: true,
      selectedFile,
    }).then(() => {
      return getFile(selectedFile).then(
        ({sentenceClassifcations, numberedSents}) => {
          const waffleBookData = prepWaffleData(sentenceClassifcations);
          const graphNodes = waffleBookData
            .reduce((acc, row) => acc.concat(row), [])
            .filter(d => {
              return d.colors.every(color => validColors[color]);
            });

          this.setState({
            data: sentenceClassifcations,
            numberedSents,
            barChartData: prepBarChart(sentenceClassifcations, validColors),
            waffleBookData,
            loading: false,
            graphNodes,
            graphLinks: generateGraphLinks(graphNodes),
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
    const {showConnections} = this.props;
    const {
      hoveredComment,
      barChartData,
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
          onSelect={newPrefix =>
            this.updateData(newPrefix, this.props.validColors)
          }
          selectedFile={selectedFile}
        />
        <div className="flex-down descriptions">
          <h3>{DESCRIPTIONS[selectedFile].fullName}</h3>
          <p>{DESCRIPTIONS[selectedFile].description}</p>
        </div>
        <div className="flex-down">
          <Graph
            showConnections={showConnections}
            nodes={graphNodes}
            links={graphLinks}
            prefix={selectedFile}
            getSentence={idx => this.state.numberedSents[idx]}
          />
          {<BarChart data={barChartData} />}
        </div>
      </div>
    );
  }
}
