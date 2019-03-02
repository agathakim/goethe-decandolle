import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import {COLORS, categoryRelationships} from '../constants';

// import TestData from '../constants/thought-component-goethe.json';
import TestData from '../constants/data2.json';
// const TestData = {};
function prepareData(data) {
  return TestData.map(row => {
    return Object.entries(row).reduce((acc, [key, value]) => {
      acc[key] = Number(value) || 0;
      return acc;
    }, {});
  });
}

const SEPERATOR_SYMBOL = '??';
function generateCombinationCounts(dataset) {
  const allKeys = Object.keys(dataset[0]).map(row => {
    if (!row.length) {
      return 'idx';
    }
    return row;
  }).filter(row => row !== 'INDEX');
  const oneLevel = allKeys.map(key => [key]);
  const twoLevel = allKeys.reduce((acc, row) => {
    return acc.concat(oneLevel.map(innerRow => innerRow.concat(row)));
    // return acc;
  }, []);
  const threeLevel = allKeys.reduce((acc, row) => {
    return acc.concat(twoLevel.map(innerRow => innerRow.concat(row)));
  }, []);

  const combos = (oneLevel.concat(twoLevel).concat(threeLevel)).map(combo => {
    return Object.keys(combo.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));
  });

  const allComboCounts = dataset.reduce((acc, row) => {
    combos.forEach(combo => {
      if (!acc[combo.join(SEPERATOR_SYMBOL)]) {
        acc[combo.join(SEPERATOR_SYMBOL)] = 0;
      }
      const isPresent = combo.every(key => row[key]);
      acc[combo.join(SEPERATOR_SYMBOL)] += (isPresent ? 1 : 0);
    });
    return acc;
  }, {});

  const reducedCounts = Object.entries(allComboCounts).reduce((acc, [key, count]) => {
    if (count) {
      acc[key] = count;
    }
    return acc;
  }, {});

  const nodes = Object.keys(reducedCounts)
    .map(name => ({name, color: COLORS[name] || 'blue'}));
  const nodeIdx = nodes.reduce((acc, {name}, idx) => {
    acc[name] = idx;
    return acc;
  }, {});
  const links = Object.entries(reducedCounts).reduce((acc, [comboString, count]) => {
    const combo = comboString.split(SEPERATOR_SYMBOL);
    if (combo.length === 1) {
      return acc;
    }
    const parentName = combo.length === 2 ? `${combo[0]}` : `${combo[0]}${SEPERATOR_SYMBOL}${combo[1]}`;
    // console.log(parentName)
    // if (!nodeIdx[parentName]) {
    //   console.log(parentName)
    // }
    return acc.concat({
      source: nodeIdx[parentName],
      target: nodeIdx[comboString],
      value: count
    });
  }, []);
  // console.log(links)
  return {nodes, links};
}

function prepTimeSeriesData(data) {
  const cats = Object.keys(data[0]);
  const timeseries = data.reduce((acc, row) => {
    cats.forEach(cat => {
      acc[cat].push(Number(row[cat]) ? 1 : 0);
    });
    return acc;
  }, cats.reduce((acc, cat) => {
    acc[cat] = [];
    return acc;
  }, {}));
  Object.keys(timeseries).forEach(cat => {
    const series = timeseries[cat];
    let height = 0;
    timeseries[cat] = series.map((val, idx) => {
      height += val;
      return ({x: idx, y: height});
    });

    // timeseries[cat] = series.map((val, idx) => {
    //   return ({x: idx, y: Number(val) ? val : 0});
    // });
  });
  timeseries[''] = [];
  return timeseries;
}

function prepSunburst(data) {
  const countsByCat = data.reduce((acc, row) => {
    categoryRelationships.forEach(({cat}) => {
      if (!acc[cat]) {
        acc[cat] = 0;
      }
      acc[cat] += (Number(row[cat]) && Number(row[cat]) || 0);
    });
    return acc;
  }, {});
  const groups = categoryRelationships.reduce((acc, row) => {
    if (!acc[row.superCat]) {
      acc[row.superCat] = [];
    }
    acc[row.superCat].push({...row, size: countsByCat[row.cat]});
    return acc;
  }, {});

  return {
    children: Object.entries(groups).map(([superCat, children]) => {
      return {
        label: superCat,
        color: COLORS[superCat],
        children: children.map(child => {
          return {...child, children: [], label: child.cat, color: COLORS[child.cat]};
        })
      };
    })
  };
}

function prepWaffleData(data) {
  const blocks = data.map((row) => {
    return Object.entries(row)
      .filter(([key, count]) => Number(count) && key !== 'INDEX')
      .map(([key, count]) => {
        return COLORS[key];
      });
  });
  // greedy algorithm
  const TARGET_WIDTH = 100;
  const rows = [];
  let currentRow = [];
  let idx = 0;
  while (idx < blocks.length) {
    const block = blocks[idx];
    const currentRowLength = currentRow.reduce((acc, row) => acc + row.length, 0);
    if ((currentRowLength + block.length) > TARGET_WIDTH) {
      rows.push(currentRow);
      currentRow = [block];
    } else {
      currentRow.push(block);
    }
    idx += 1;
  }
  const offsettedRows = rows.map(row => {
    let offset = 0;
    return row.map(colors => {
      const newRow = {
        colors,
        offset
      };
      offset += colors.length;
      return newRow;
    });
  });

  return offsettedRows;
}

const preparedData = prepareData(TestData);
const DEFAULT_STATE = Immutable.fromJS({
  data: generateCombinationCounts(preparedData.slice(0, 2)),
  timeSeriesData: prepTimeSeriesData(preparedData),
  sunburstData: prepSunburst(preparedData),
  waffleBookData: prepWaffleData(preparedData)
});

const actionFuncMap = {};
const NULL_ACTION = (state, payload) => state;

export default createStore(
  combineReducers({
    base: (state = DEFAULT_STATE, {type, payload}) =>
      (actionFuncMap[type] || NULL_ACTION)(state, payload)
  }),
  applyMiddleware(thunk),
);
