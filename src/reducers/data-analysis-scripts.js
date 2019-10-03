import {COLORS, categoryRelationships, TARGET_WIDTH} from '../constants';
const SEPERATOR_SYMBOL = '??';
export function generateCombinationCounts(dataset) {
  const allKeys = Object.keys(dataset[0])
    .map(row => {
      if (!row.length) {
        return 'idx';
      }
      return row;
    })
    .filter(row => row !== 'index');
  const oneLevel = allKeys.map(key => [key]);
  const twoLevel = allKeys.reduce((acc, row) => {
    return acc.concat(oneLevel.map(innerRow => innerRow.concat(row)));
    // return acc;
  }, []);
  const threeLevel = allKeys.reduce((acc, row) => {
    return acc.concat(twoLevel.map(innerRow => innerRow.concat(row)));
  }, []);

  const combos = oneLevel
    .concat(twoLevel)
    .concat(threeLevel)
    .map(combo => {
      return Object.keys(
        combo.reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {}),
      );
    });

  const allComboCounts = dataset.reduce((acc, row) => {
    combos.forEach(combo => {
      if (!acc[combo.join(SEPERATOR_SYMBOL)]) {
        acc[combo.join(SEPERATOR_SYMBOL)] = 0;
      }
      const isPresent = combo.every(key => row[key]);
      acc[combo.join(SEPERATOR_SYMBOL)] += isPresent ? 1 : 0;
    });
    return acc;
  }, {});

  const reducedCounts = Object.entries(allComboCounts).reduce(
    (acc, [key, count]) => {
      if (count) {
        acc[key] = count;
      }
      return acc;
    },
    {},
  );

  const nodes = Object.keys(reducedCounts).map(name => ({
    name,
    color: COLORS[name] || 'blue',
  }));
  const nodeIdx = nodes.reduce((acc, {name}, idx) => {
    acc[name] = idx;
    return acc;
  }, {});
  const links = Object.entries(reducedCounts).reduce(
    (acc, [comboString, count]) => {
      const combo = comboString.split(SEPERATOR_SYMBOL);
      if (combo.length === 1) {
        return acc;
      }
      const parentName =
        combo.length === 2
          ? `${combo[0]}`
          : `${combo[0]}${SEPERATOR_SYMBOL}${combo[1]}`;
      // console.log(parentName)
      // if (!nodeIdx[parentName]) {
      //   console.log(parentName)
      // }
      return acc.concat({
        source: nodeIdx[parentName],
        target: nodeIdx[comboString],
        value: count,
      });
    },
    [],
  );
  // console.log(links)
  return {nodes, links};
}

export function prepTimeSeriesData(data) {
  const cats = Object.keys(data[0]);
  const timeseries = data.reduce(
    (acc, row) => {
      cats.forEach(cat => {
        acc[cat].push(Number(row[cat]) ? 1 : 0);
      });
      return acc;
    },
    cats.reduce((acc, cat) => {
      acc[cat] = [];
      return acc;
    }, {}),
  );
  Object.keys(timeseries).forEach(cat => {
    const series = timeseries[cat];
    let height = 0;
    timeseries[cat] = series.map((val, idx) => {
      height += val;
      return {x: idx, y: height};
    });

    // timeseries[cat] = series.map((val, idx) => {
    //   return ({x: idx, y: Number(val) ? val : 0});
    // });
  });
  timeseries[''] = [];
  return timeseries;
}
