import React from 'react';
import BarChart from './barchart';
import Graph from './graph';
import Picker from './file-picker';
import StackedBarChart from './treemap';
// import RelativeCounts from './relative-counts';

import {files, DESCRIPTIONS, WAFFLE_WIDTH} from '../constants';
import {getFile, prepBarChart, prepWaffleData, colorSentences} from '../utils';

function generateNodes(waffleBookData, validColors, useInclusive) {
  return waffleBookData
    .reduce((acc, row) => acc.concat(row), [])
    .filter(d => {
      // i think this should be every, but i think agatha expects some. shruggie.
      if (useInclusive) {
        return d.colors.some(color => validColors[color]);
      }
      return d.colors.every(color => validColors[color]);
    });
}

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
      selectedFile: props.defaultSelection || files[0].filePrefix,
      barChartData: null,
      waffleBookData: null,
      loading: true,
      lockedWaffle: false,
    };
    this.setAsyncState = this.setAsyncState.bind(this);
    this.updateData = this.updateData.bind(this);
  }
  componentDidMount() {
    const {validColors, useInclusive} = this.props;
    this.updateData(this.state.selectedFile, validColors, useInclusive);
  }

  componentDidUpdate(oldProps) {
    if (oldProps.calcIdx !== this.props.calcIdx) {
      const {validColors, useInclusive} = this.props;
      this.updateData(this.state.selectedFile, validColors, useInclusive);
    }
  }

  setAsyncState(newState) {
    return new Promise(resolve => this.setState(newState, () => resolve()));
  }

  updateData(selectedFile, validColors, useInclusive) {
    // defaults to loading goethe
    this.setAsyncState({
      loading: true,
      selectedFile,
    }).then(() => {
      return getFile(selectedFile).then(
        ({sentenceClassifcations, numberedSents}) => {
          const waffleBookData = prepWaffleData(sentenceClassifcations);
          const graphNodes = generateNodes(
            waffleBookData,
            validColors,
            useInclusive,
          );
          const data = colorSentences(sentenceClassifcations);
          this.setState({
            data,
            numberedSents,
            barChartData: prepBarChart(data, validColors, useInclusive),
            waffleBookData,
            loading: false,
            graphNodes,
            graphLinks: generateGraphLinks(graphNodes),
            cooccuranceData: data.reduce((acc, row) => {
              const key = JSON.stringify(row.colors);
              acc[key] = (acc[key] || 0) + 1;
              return acc;
            }, {}),
          });
        },
      );
    });
  }

  render() {
    const {showConnections, sendOffscreenNotAvailable} = this.props;
    const {
      barChartData,
      cooccuranceData,
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
          <h3 className="text-title">{DESCRIPTIONS[selectedFile].fullName}</h3>
          <p className="text-description">
            {DESCRIPTIONS[selectedFile].description}
          </p>
        </div>
        <div className="flex-down">
          <Graph
            cooccuranceData={cooccuranceData}
            showConnections={showConnections}
            nodes={graphNodes}
            links={graphLinks}
            prefix={selectedFile}
            sendOffscreenNotAvailable={sendOffscreenNotAvailable}
            barChartData={barChartData}
            getSentence={idx => this.state.numberedSents[idx]}
          />
          {
            // <RelativeCounts data={data} />
          }
          <BarChart data={barChartData} />
          <StackedBarChart data={barChartData} />
        </div>
      </div>
    );
  }
}
